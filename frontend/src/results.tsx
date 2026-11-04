/* Results + Export area for main page */
import {AnalysisResult} from '../../lib/transcription-analysis_types'
import './App.css';

type AnalysisViewProps = {
    result: AnalysisResult
}

/**
 *
 * @param param0
 * @param param0.result
 * @constructor
 */
export function AnalysisView({ result }: AnalysisViewProps) {
    return (
        <div className="mt-8 p-5 bg-gray-20 border border-white rounded-lg">
            <h2 className="font-display text-sm font-bold text-white tracking-wider mb-3">Analysis Output</h2>
            <br/>
            <p className="text-left font-display text-sm text-white tracking-wider mb-3">JSON response sent from the
                backend:</p>
            <pre className="text-left font-display text-sm text-white overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
        </div>
    )
}

