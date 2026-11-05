import type { AnalysisResult, GCContent } from '../../lib/transcription-analysis_types';

// Calculate DNA sequence length
export function calculateSequenceLength(dna: string): number {

    return dna.length;

}

// Count individual nucleotides (occurrences)
export function countNucleotides(dna: string): { 
    A: number;
    T: number;
    C: number;
    G: number;
} {

    let countA = 0;
    let countT = 0;
    let countC = 0;
    let countG = 0;

    // ensure all chars are uppercase 
    dna = dna.toUpperCase();


    for (let i = 0; i < dna.length; i++) {

        if (dna[i] === "A") {
            countA++;
        }

        else if (dna[i] === "T") {
            countT++;
        }

        else if (dna[i] === "C") {
            countC++;
        }

        else if (dna[i] === "G") {
            countG++;
        }

    }   
    
    return {
        A: countA,
        T: countT,
        C: countC,
        G: countG
    };
    
}

// Individual G and C contents 
export function calculateGCContent(dna: string): GCContent {
  if (dna.length === 0) {
    return { guaninePercent: 0, cytosinePercent: 0 };
  }

  const counts = countNucleotides(dna);

  return {
    guaninePercent: (counts.G/ dna.length) * 100,
    cytosinePercent: (counts.C/ dna.length) * 100,
  };

}

// interface AnalysisResult{
//     //DNA Analysis
//     sequenceLength: Number,
//     gc: GCContent,
//     // Transcription
//     RNASequence: string
// }

// interface GCContent{
//     guaninePercent: Number, // ect. 35.4% G as 35.4
//     cytosinePercent : Number
// }

export function analyzeDNA(dna: string): AnalysisResult {

     return {

        sequenceLength: dna.length,

        gc: calculateGCContent(dna)
    };
}


