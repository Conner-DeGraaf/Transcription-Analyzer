
import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import crytpo from 'crypto'
import { AnalysisResult, GCContent } from '../lib/transcription-analysis_types';

const transcriptionResults = new Map<string, SavedResult>();

interface SavedResult {
    fileName: string,
    fileData: string
}

/**
 * Creates the text of an output .fasta given the original file contents it came from and the rna after transcription.
 * @param rna 
 * @param inputFASTA The FASTA file lines expected in the format `> HEADER\nGBTAC `
 */
function CreateOutputFile(rna: string, inputFASTA: string) {
    // Get the header line
    var outputFasta = inputFASTA.slice(0, inputFASTA.indexOf('\n'));
    outputFasta += `\n${rna}`
    return outputFasta;
}

/**
 *  Saves the transcription results to be downloaded by the user later.
 * @param fileName - file name used as the default file name when downloading. Should be from the original file.
 * @param rna - The full RNA string after transcription to be used in the FASTA output.
 * @param inputFASTA - The FASTA file lines expected in the format `> HEADER\nGBTAC `
 * @returns - The URL that the results can be downloaded at.
*/
function SaveResults(fileName: string, rna: string, inputFASTA: string): string {
    console.log(`File name: ${fileName}`)

    var outputFileName = fileName
    if (fileName.indexOf('.') != -1) {
        outputFileName = fileName.substring(0, fileName.indexOf('.'));
    }
    outputFileName += ".transcribed.frn";

    const result: SavedResult = {
        fileName: outputFileName,
        fileData: CreateOutputFile(rna, inputFASTA)
    }


    const resultID = crypto.randomUUID();
    transcriptionResults.set(resultID, result);

    console.log(`Saved ${result.fileData} at ${resultID} with name ${result.fileName}`);

    const msToDeleteAfter = 3600000;
    setTimeout(() => {
        transcriptionResults.delete(resultID);
    }, msToDeleteAfter);

    const downloadURL = `/api/results/${resultID}`

    return downloadURL;
}

/**
 * Gets the results saved under an id.
 * @param req 
 * @param res 
 */
function GetResults(req: Request, res: Response) {

    const resultID = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const savedResult = transcriptionResults.get(resultID);

    if (!savedResult) {
        return res.status(400).send("Result has expired, or could not be found.");
    }


    res.setHeader('Content-Disposition', `attachment; filename=${savedResult.fileName}`);
    res.setHeader('Content-Type', 'text/plain');
    res.send(savedResult.fileData);
}

export { GetResults, SaveResults }