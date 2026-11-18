/* Front loading page for website */
import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';
import {AnalysisView} from "./results.tsx";
import { AnalysisResult } from '../../lib/transcription-analysis_types'


function App() {
  const [file, setFile] = useState<File | null>(null);
  const [direction, setDirection] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleDirectionChange = (e: ChangeEvent<HTMLSelectElement>) => {
  if (e.target.value) {
    setDirection(e.target.value);
    setResult(null);
  }
};

  const handleUpload = async (e: ChangeEvent<HTMLFormElement>) => {
    console.log("handling upload");
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('direction', direction);

    try {

      console.log("Posting");
      const response = await axios.post<AnalysisResult>('http://localhost:3420/api/analyze', formData);
      if(response.data && response.data.gc) setResult(response.data);
      setUploadError(null);

      console.log("Response Received " + JSON.stringify(response.data));
    } catch (error : any) {
      const message = error.response?.data?.error ?? 'Upload failed. Please try again.';
      setUploadError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="center">
        <h1 className='font-display'>Transcription Analyzer</h1>
        <div className='bg-[#1E293B] shadow-md rounded-xl p-10 m-10'>
          <form onSubmit={handleUpload} className='grid grid-cols-1 lg:grid-cols-2 mb-5 space-y-3 lg:space-y-1'>
          <div className='flex mx-1'>
            <input
              type="file"
              onChange={handleFileChange}
              aria-label="Upload FASTA file"
              accept=".fa,.fasta,.fna,.ffn,.fas" // Explicitly don't include .faa because those are for amino acid sequences
              className='font-display w-full h-full rounded-md bg-[#334155] text-[#F8FAFC] p-2 mx-1'
              required
            />
            <select
              name="direction"
              aria-label="Direction of Strand"
              className='font-display rounded-md bg-[#334155] text-[#F8FAFC] p-2'
              onChange={handleDirectionChange}
              disabled={!file||loading}
              required>
              <option value="">Direction</option>
              <option value="5'->3'">5' -&gt; 3'</option>
              <option value="3'->5'">3' -&gt; 5'</option>
            </select>
          </div>
          <div>
            <button
              type="submit"
              className="bg-[#059669] text-white w-full py-2 px-4 rounded-lg hover:bg-[#047857] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              disabled={!file || loading || !direction}
            >
              {loading ? 'Analyzing...' : (file && direction ? ('Run Analysis on ' + file?.name) : 'Attach a file to run analysis')}
            </button>
          </div>
        </form>
        {result && (<AnalysisView result={result} />)}
      </div>
      </section>

      <section id="spacer"></section>

    </>

  )
}

export default App