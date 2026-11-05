
interface AnalysisResult{
    //DNA Analysis
    sequenceLength: number,
    gc: GCContent,
    // Transcription
    RNASequence: string,
    rnaDownload: string
}

interface GCContent{
    guaninePercent: number, // ect. 35.4% G as 35.4
    cytosinePercent : number
}

export type {AnalysisResult, GCContent};