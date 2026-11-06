
import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import { AnalysisResult, GCContent } from '../lib/transcription-analysis_types';
import { GetResults, SaveResults } from './results';
import { isNotValidDNASequence, isNotValidFastaFormat } from './validation/validation';
import { parseDNAFromFASTA } from './parse-dna';
import { analyzeDNA } from './dnaAnalysis/dnaanalysis';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Transcription Analyzer API',
      version: '2.0.0',
      description: 'API documentation for the DNA to mRNA Transcription Analyzer',
    },
  },
  // Tells Swagger where to look for your JSDoc comments
  apis: [path.join(__dirname, 'index.ts')], 
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))



// Store files in memory without writing to disk
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

interface MulterRequest extends Request {
    file?: Express.Multer.File;
    body: {
        direction?: string; // "5'->3'" or "3'->5'"
    }
}
/**
 * @openapi
 * /api/analyze:
 *   post:
 *     summary: Analyze and transcribe a DNA FASTA file
 *     description: Accepts a FASTA file and sequence direction, validates it, and transcribes the DNA into an mRNA sequence.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The uploaded FASTA file (.fa, .fasta, .fna, .ffn, .fas)
 *               direction:
 *                 type: string
 *                 enum: ["5'->3'", "3'->5'"]
 *                 description: Sequence direction
 *     responses:
 *       200:
 *         description: Successfully analyzed and transcribed DNA
 *       400:
 *         description: Bad Request (Missing file)
 *       422:
 *         description: Unprocessable Entity (Invalid format or sequence)
 */
app.post('/api/analyze', upload.single('file'), (req: MulterRequest, res: Response): any => {

    // If you want to learn more about req.file look at
    // https://github.com/expressjs/multer#API
    // It will tell you where to get file size, name, encoding ect.
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Validate FASTA file
    if (isNotValidFastaFormat(req.file)) {
        return res.status(422).json({ error: 'Invalid FASTA file format.' });
    };

    // This is the raw file buffer that contains the uploaded FASTA file.
    const fileData = req.file.buffer.toString('utf-8');

    if (isNotValidDNASequence(fileData)) {
        return res.status(422).json({ error: 'Invalid DNA sequence.' });
    }

    const dnaSequence = parseDNAFromFASTA(fileData, req.body.direction!);

    // Create GC Content & Other DNA Analysis
    var results : AnalysisResult = analyzeDNA(dnaSequence);

    // TODO: Addison
    // Transcription
    results.RNASequence = ""

    results.rnaDownload = SaveResults(req.file.originalname, results.RNASequence, fileData);

    // Fill this in with the information that needs to be sent back to the frontend UI.

    res.json(results);
});
}
/**
 * @openapi
 * /api/results/:
 *   post:
 *     summary: Gets the resultant fasta file after transcription.
 *     description: Accepts a FASTA file and sequence direction, validates it, and transcribes the DNA into an mRNA sequence.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The uploaded FASTA file (.fa, .fasta, .fna, .ffn, .fas)
 *               direction:
 *                 type: string
 *                 enum: ["5'->3'", "3'->5'"]
 *                 description: Sequence direction
 *     responses:
 *       200:
 *         description: Successfully analyzed and transcribed DNA
 *       400:
 *         description: Bad Request (Missing file)
 *       422:
 *         description: Unprocessable Entity (Invalid format or sequence)
 */
app.get('/api/results/:id', GetResults);


if (process.env.NODE_ENV != 'test') {
    app.listen(3420, () => console.log('Backend running on port 3420'));
}

export default app;