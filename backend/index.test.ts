import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app, { transcribeCodingDNA, transcribeTemplateDNA } from './index';

// This file can be used to write backend unit tests

// I've written this example, but we should make at least one for every backend requirement.

// If you want to test new files in the future, any *.test.js file should be tested when you run `npm run test`.
// transcription unit test added (perhaps)
describe('DNA transcription', () => {

    it('converts coding DNA to RNA', () => {
        expect(transcribeCodingDNA('ATGC')).toBe('AUGC');
    });

    it('handles lowercase coding DNA', () => {
        expect(transcribeCodingDNA('atgc')).toBe('AUGC');
    });

    it('transcribes a template written 3 to 5', () => {
        expect(transcribeTemplateDNA('TACG')).toBe('CGUA');
    });

    it('handles lowercase template DNA', ()=>{
        expect(transcribeTemplateDNA('tacg')).toBe('CGUA');
    }); 

});

describe('POST /api/analyze', () => {
    describe("FR-02", () => {
        it('Should return error 400 if no file is attached.', async () => {
            const res = await request(app).post('/api/analyze');
            expect(res.status).toBe(400);
            expect(res.text).toBe('No file uploaded.');
        });
    })
}
);