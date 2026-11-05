
import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { AnalysisResult, GCContent } from '../lib/transcription-analysis_types';
import { GetResults, SaveResults } from './results'
import { isNotValidDNASequence, isNotValidFastaFormat } from './validation/validation';


const app = express();
app.use(cors());
app.use(express.json());



// Store files in memory without writing to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

interface MulterRequest extends Request {
    file?: Express.Multer.File;
    body: {
        direction?: string;
    }
}

// Takes in a raw FASTA file and returns a string of DNA (GTCA)
function ValidateFASTAFile(fileData: string): string {
    if (!fileData) {
        throw new Error("Empty file")
    }

    // Other checks

    return "GTCA";
}

app.post('/api/analyze', upload.single('file'), (req: MulterRequest, res: Response): any => {

    // If you want to learn more about req.file look at
    // https://github.com/expressjs/multer#API
    // It will tell you where to get file size, name, encoding ect.
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Validate FASTA file
    if(isNotValidFastaFormat(req.file)){
        return res.status(422).json({ error: 'Invalid FASTA file format.' });
    };

    // This is the raw file buffer that contains the uploaded FASTA file.
    const fileData = req.file.buffer.toString('utf-8');

    console.log("File received with data: \n" + fileData);
    console.log("Received direction: " + req.body.direction);

    if(isNotValidDNASequence(fileData)){
        return res.status(422).json({ error: 'Invalid DNA sequence.' });
    }

    // TODO: Ashton
    // Create GC Content & Other DNA Analysis
    const gc: GCContent = { "cytosinePercent": 0, "guaninePercent": 0 }

    // TODO: Addison
    // Transcription
    const RNASequence = ""

    const rnaDownloadURL = SaveResults(req.file.originalname, RNASequence, fileData);

    // Fill this in with the information that needs to be sent back to the frontend UI.
    const someTranscriptionResults: AnalysisResult = {
        sequenceLength: 0,
        gc,
        RNASequence,
        rnaDownload: rnaDownloadURL
    };

    res.json(someTranscriptionResults);
});
app.get('/api/results/:id', GetResults);

if (process.env.NODE_ENV != 'test') {
    app.listen(3420, () => console.log('Backend running on port 3420'));
}

export default app;