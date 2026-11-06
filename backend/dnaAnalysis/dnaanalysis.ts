import type { AnalysisResult, GCContent } from '../../lib/transcription-analysis_types';

/**
 * Count individual nucleotides (occurrences)
 * @param dna DNA sequence of bases as chars. ex 'GGBCA'. Can be lowercase or uppercase.
 * @returns Object containing counts indexed by character 
 */
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


/**
 * Calculates guaninePercent and cytosinePercent as (0-100)% from a dna sequence. Used for GC Content in analysis.
 * @param dna DNA sequence of bases as chars. ex 'GGBCA'. Can be lowercase or uppercase.
 * @returns Object containing guaninePercent and cytosinePercent.
 */
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

/**
 * Creates an AnalysisResult with everything but transcription information filled out.
 * @param dna DNA sequence of bases as chars. ex 'GGBCA'. Can be lowercase or uppercase.
 * @returns An AnalysisResult with sequenceLength, and gc filled out, and an empty RNASequence and rnaDownload.
 */
export function analyzeDNA(dna: string): AnalysisResult {

     return {

        sequenceLength: dna.length,
        RNASequence: "",
        "rnaDownload": "",
        gc: calculateGCContent(dna)
    };
}


