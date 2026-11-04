import { describe, it, expect } from 'vitest';
import request, { Response, Request } from 'supertest'
import path from 'path'
import app from './index'
import { _testExports, GetResults, SaveResults } from './results'

async function uploadTestFile(): Promise<Response> {
    const filePath = path.resolve(__dirname, '../TestGenome.fa');
    return await request(app)
        .post('/api/analyze')
        .attach('file', filePath)
        .field('direction', "5' -> 3'");
}

describe('POST /api/results', () => {
    describe("FR-39", () => {
        it('Should return error 400 if nothing is available to export.', async () => {
            const res = await request(app).get('/api/results/ThisDoesNotExist');
            expect(res.status).toBe(400);
            expect(res.text).toBe("Result has expired, or could not be found.");
        });
    }),
        describe("FR-38", () => {
            it('Should give a valid download url for the output file.', async () => {
                const uploadRes = await uploadTestFile();
                expect(uploadRes).toBeDefined();
                const res = await request(app).get(uploadRes.body.rnaDownload);
                expect(res.status).toBe(200);
                expect(res.text.substring(0, 20)).toBe(">ref|NC_000001.11|:2");
            });
        })
    describe("FR-36", () => {
        it('A file is generated from input.', async () => {
            expect(_testExports).toBeDefined();
            expect(_testExports?.transcriptionResults).toBeDefined();
            _testExports?.transcriptionResults.clear();
            SaveResults('TESTFILENAME', 'UTA', '> TESTHEADER\nTCG');

            expect(_testExports?.transcriptionResults.size).toBe(1);
        });
        it('A correct header is included at the end of transcription output file.', async () => {
            expect(_testExports).toBeDefined();
            expect(_testExports?.transcriptionResults).toBeDefined();
            SaveResults('TESTFILENAME', 'UTA', '> TESTHEADER\nTCG');

            const generatedKey = _testExports?.transcriptionResults.keys().next().value!;
            const storedResult = _testExports?.transcriptionResults.get(generatedKey);
            expect(storedResult?.fileData.substring(0, 12)).toBe("> TESTHEADER");
        });
        it('A correct header is included at the end of transcription output file.', async () => {
            expect(_testExports).toBeDefined();
            expect(_testExports?.transcriptionResults).toBeDefined();
            SaveResults('TESTFILENAME', 'UTA', '> TESTHEADER\nTCG');

            const generatedKey = _testExports?.transcriptionResults.keys().next().value!;
            const storedResult = _testExports?.transcriptionResults.get(generatedKey);
            expect(storedResult?.fileData.substring(0, 12)).toBe("> TESTHEADER");
        });

        it('RNA is found on the second line of the transcription output file.', async () => {
            expect(_testExports).toBeDefined();
            expect(_testExports?.transcriptionResults).toBeDefined();
            SaveResults('TESTFILENAME', 'UTA', '> TESTHEADER\nTCG');

            const generatedKey = _testExports?.transcriptionResults.keys().next().value!;
            const storedResult = _testExports?.transcriptionResults.get(generatedKey);
            expect(storedResult?.fileData.substring(storedResult?.fileData.indexOf('\n')+1)).toBe("UTA");
        });
    })
}
);