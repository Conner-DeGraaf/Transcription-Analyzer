


export function isNotValidDNASequence(fileData: string): boolean {
    if (!fileData) {
        return true;
    }


    // Remove whitespace/newlines and header lines
    const cleanSequence = fileData
        .replace(/^>.*$/gm, '')
        .replace(/\[\d+\]/g, '')
        .replace(/\s+/g, '');


    // Non-empty check
    if (cleanSequence.length === 0) {
        return true;
    }


    // Strictly A, C, G, T characters (case-insensitive)
    const validDnaRegex = /^[ACGTacgt]+$/;
    if (!validDnaRegex.test(cleanSequence)) {
        return true;
    }


    return false;
}


export function isNotValidFastaFormat(file?: Express.Multer.File): boolean {
    if (!file) return true;


    const originalName = file.originalname || '';


    // Validate file extension (.fasta, .fa, .fna)
    const validExtension = /\.(fasta|fa|fna|ffn|fas)$/i.test(originalName);
    if (!validExtension) return true;


    // Inspect file content
    const fileContent = file.buffer.toString('utf-8').replace(/^\uFEFF/, '').trim();
    if (!fileContent) return true;


    const lines = fileContent.split(/\r?\n/);


    let headerCount = 0;
    let currentSequenceLength = 0;


    // Check each header and its associated sequence length
    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue; // Skip blank lines between records


        if (trimmedLine.startsWith('>')) {
            // If entering a new header, verify the preceding header had sequence content
            if (headerCount > 0 && currentSequenceLength === 0) {
                return true;
            }
            headerCount++;
            currentSequenceLength = 0;
        } else {
            // Sequence line appearing before any header is invalid
            if (headerCount === 0) return true;
            currentSequenceLength += trimmedLine.length;
        }
    }


    // Ensure at least one header was found and the final sequence is non-empty
    if (headerCount === 0 || currentSequenceLength === 0) return true;


    return false;
}
