
/**
 * Only parses the first sequence in a file.
 * TODO: In the future the whole project should handle multiple sequences per file better.
 * probably either error out when given multiple sequences, concat sequences, or at least notify the user only the first sequence was used. 
 * @param rawFASTA The contents fo the FASTA file
 * @param rawFASTA Either "5'->3'" or "3'->5'"
 * @returns a string of dna 
 */
export function parseDNAFromFASTA(rawFASTA: string, direction: string): string {
    if(!(["5'->3'","3'->5'"].includes(direction))) throw new Error("direction is invalid, must be either 5'->3' or 3'->5'");
    const lines = rawFASTA.split(/\r?\n/);

    //Grabs the next line after the header
    var readingSeq = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i][0] == ">") {
            readingSeq = true;
        }
        else if (readingSeq) {
            if(direction == "3'->5'") return lines[i].split("").reverse().join(""); // Reverses the string by converting it to an array
            else return lines[i];
        }
    }
    throw new Error("Could not find header to parse after");
}