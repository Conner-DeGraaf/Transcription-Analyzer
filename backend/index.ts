
import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { AnalysisResult, GCContent } from '../lib/transcription-analysis_types'

const app = express();
app.use(cors());
app.use(express.json());

// Store files in memory without writing to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

interface MulterRequest extends Request {
    file?: Express.Multer.File;
    body: {
        strand: any;
        direction?: string;
    }
}

// Takes in a raw FASTA file and returns a string of DNA (GTCA)
function ValidateFASTAFile(fileData : string): string
{
    if(!fileData){
        throw new Error("Empty file")
    }

    // Other checks

    return "GTCA";
}

// Transcription function below
// Coding in 5'-3'
function transcribeCodingDNA(dna: string):
string {
    return dna.toUpperCase().replaceAll('T', 'U');
}
// Template in 3'-5' direction
function transcribeTemplateDNA(template: string): 
string {
    const dna = template.toUpperCase();
    let mrna = "";

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

app.post('/api/analyze', upload.single('file'), (req : MulterRequest, res : Response): any => {

    // If you want to learn more about req.file look at
    // https://github.com/expressjs/multer#API
    // It will tell you where to get file size, name, encoding ect.
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // This is the raw file buffer that contains the uploaded FASTA file.
    const fileData = req.file.buffer.toString('utf-8');

    console.log("File received with data: \n" + fileData);
    console.log("Received direction: " + req.body.direction);

    // TODO: Conner
    // Validate FASTA file
    const dna: string = ValidateFASTAFile(fileData);

    // TODO: Ashton
    // Create GC Content & Other DNA Analysis
    const gc : GCContent = {"cytosinePercent": 0, "guaninePercent": 0}

    // TODO: Addison
    // Transcription
    const strand = req.body?.strand;

    if (strand !== "coding" && strand !== "template") {
        return res.status(400).send("Select coding or template strand.");
    }

    const RNASequence = strand === "coding" ? transcribeCodingDNA(dna) : transcribeTemplateDNA(dna);

    // Fill this in with the information that needs to be sent back to the frontend UI.
    const someTranscriptionResults: AnalysisResult = {
        sequenceLength: 0,
        gc,
        RNASequence
    };

    res.json(someTranscriptionResults);
});

if (process.env.NODE_ENV != 'test') {
    app.listen(3420, () => console.log('Backend running on port 3420'));
}

export default app;
export { transcribeCodingDNA, transcribeTemplateDNA };