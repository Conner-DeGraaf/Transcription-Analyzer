
import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
app.use(cors());
app.use(express.json());

// Store files in memory without writing to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

interface AnalysisResult{
    realDNAInfo: string,
    otherInfo: string
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

    console.log("File recived with data: " + fileData);



    // Fill this in with the information that needs to be sent back to the frontend UI.
    const someTranscriptionResults: AnalysisResult = {
        realDNAInfo: 'So true',
        otherInfo: 'replace me'
    };

    res.json(someTranscriptionResults);
});

if (process.env.NODE_ENV != 'test') {
    app.listen(3420, () => console.log('Backend running on port 3420'));
}

export default app;