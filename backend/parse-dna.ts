import { addUncaughtExceptionCaptureCallback } from "node:process";

/**
 * Only parses the first sequence in a file.
 * TODO: In the future the whole project should handle multiple sequences per file better.
 * probably either error out when given multiple sequences, concat sequences, or at least notify the user only the first sequence was used. 
 * @param rawFASTA The contents fo the FASTA file
 * @returns a string of dna 
 */
export function parseDNAFromFASTA(rawFASTA: string): string {
    const lines = rawFASTA.split(/\r?\n/);

    //Grabs the next line after the header
    var readingSeq = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i][0] == ">") {
            readingSeq = true;
        }
        else if (readingSeq) {
            return lines[i];
        }
    }
    throw new Error("Could not find header to parse after");
}