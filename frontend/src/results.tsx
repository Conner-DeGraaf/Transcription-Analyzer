/* Results + Export area for main page */
import {AnalysisResult} from '../../lib/transcription-analysis_types'
import './App.css';

/**
 * Analysis output
 * @param param0
 * @param param0.result
 * @constructor
 */
export function AnalysisView({ result }: { result: AnalysisResult }) {
    const { gc } = result
    const gcTotal = gc.guaninePercent + gc.cytosinePercent

    return (
        <div className="bg-gray-900 text-white p-5 rounded-lg">
            <p>Length: {result.sequenceLength} bp</p>
            <p>GC content: {gcTotal.toFixed(1)}%</p>
            <pre className="whitespace-pre-wrap break-all">{result.RNASequence}</pre>
            <a href={result.rnaDownload} className='text-left text-lime-200'><p>Download results</p></a>
        </div>
    )
}

