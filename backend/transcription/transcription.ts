function transcribeCodingDNA(dna: string):
string {
    return dna.toUpperCase().replaceAll('T', 'U');
}

function transcribeTemplateDNA(template: string):
string {
    const dna = template.toUpperCase();
    let mrna = ""

    for (let i = dna.length - 1; i >= 0; i--) {
        const base = dna[i];

        if (base === "A") mrna += "U";
        else if (base === "T") mrna += "A";
        else if (base === "C") mrna += "G";
        else if (base === "G") mrna += "C";
        else throw new Error("Invalid DNA base: " + base);
    }
    return mrna;
}

export { transcribeCodingDNA, transcribeTemplateDNA };