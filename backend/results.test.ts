import { describe, it, expect } from 'vitest';
import request from 'supertest'
import app from './index'


describe('POST /api/results', () => {
    describe("FR-39", () => {
        it('Should return error 400 if nothing is available to export.', async () => {
            const res = await request(app).get('/api/results/ThisDoesNotExist');
            expect(res.status).toBe(400);
            expect(res.text).toBe("Result has expired, or could not be found.");
        });
    })
    /*
    describe("FR-37", () => {
        it('Should give a valid download url for the output file.', async () => {
            uploadTestFile()
            const res = await request(app).get('/api/results/ThisDoesNotExist');
            expect(res.status).toBe(400);
            expect(res.text).toBe("Result has expired, or could not be found.");
        });
    })
        */
}
);