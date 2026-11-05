/* Front loading page for website */
import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';
import {AnalysisView} from "./results.tsx";
import { AnalysisResult } from '../../lib/transcription-analysis_types'


function App() {
  const [file, setFile] = useState<File | null>(null);
  const [direction, setDirection] = useState("5'->3'");
  const [result, setResult] = useState<AnalysisResult | null>(null);
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
      setResult(response.data);

      console.log("Response Received " + JSON.stringify(response.data));
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <section id="center">
        <h1 className='font-display'>Transcript Analyzer</h1>
        <div className="border-2 border-gray-100 p-1 m-3">
        <table>
          <tbody>
          <tr>
            <td>
              <input
                type="file"
                onChange={handleFileChange}
                aria-label="Upload FASTA file"
                accept=".fa,.fasta,.fna,.ffn,.fas" // Explicitly don't include .faa because those are for amino acid sequences
                className="font-display inline text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-indigo-50 hover:file:bg-indigo-100 transition-colors"
              />
              <label>Sequence Direction: </label>
              <select
                name="direction"
                // disabled={!file||loading}
                onChange={handleDirectionChange}>
                <option value="5'->3'">5' -&gt; 3'</option>
                <option value="3'->5'">3'-&gt; 5'</option>
              </select>
            </td>
          </tr>
          </tbody>
        </table>
        </div>
        <form onSubmit={handleUpload} className="flex flex-col gap-5">
          <button
            type="submit"
            className="bg-emerald-700 text-white py-2.5 px-4 rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={!file || loading}
          >
            {loading ? 'Analyzing...' : (file ? ('Run Analysis on ' + file?.name) : 'Attach a file to run analysis')}
          </button>
        </form>
        {result && (<AnalysisView result={result} />
            <a href={result.rnaDownload} className='text-left text-lime-200'><p>Download results</p></a>)}
      </section>

      <section id="spacer"></section>

    </>

  )
}

export default App
