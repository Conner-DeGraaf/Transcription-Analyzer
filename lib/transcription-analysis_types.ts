import { getCompileCacheDir } from "node:module"


interface AnalysisResult{
    //DNA Analysis
    sequenceLength: Number,
    gc: GCContent,
    // Transcription
    RNASequence: string
}

interface GCContent{
    guaninePercent: Number, // ect. 35.4% G as 35.4
    cytosinePercent : Number
}

export type {AnalysisResult, GCContent};