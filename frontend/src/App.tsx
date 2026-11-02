import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import './App.css';

// From backend/index.ts
interface AnalysisResult {
  realDNAInfo: string;
  otherInfo: string;
}


function App() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
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

    try {

      console.log("Posting");
      const response = await axios.post<AnalysisResult>('http://localhost:3420/api/analyze', formData);
      setResult(response.data);

      console.log("Response Recived " + JSON.stringify(response.data));
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <section id="center">
        <h1 className='font-display'>Insert fully working transcription analyzer here :)</h1>

        <form onSubmit={handleUpload} className="flex flex-col gap-5">
          <input
            type="file"
            onChange={handleFileChange}
            aria-label="Upload FASTA file"
            accept=".fa,.fasta,.fna,.ffn,.fas" // Explicitly don't include .faa because those are for amino acid sequences
            className="font-display block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
          />
          <button
            type="submit"
            className="bg-emerald-700 text-white py-2.5 px-4 rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            disabled={!file || loading}
          >
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </button>
        </form>
        {result && (
          <div className="mt-8 p-5 bg-gray-20 border border-white rounded-lg">
            <h2 className="font-display text-sm font-bold text-white tracking-wider mb-3">Analysis Output</h2>
            <p className="text-left font-display text-sm text-white tracking-wider mb-3">Replace this section with a good looking ui using the json result.</p>
            <br />
            <p className="text-left font-display text-sm text-white tracking-wider mb-3">JSON response sent from the backend:</p>
            <pre className="text-left font-display text-sm text-white overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </section>

      <section id="spacer"></section>

    </>

  )
}

export default App
