import { describe, it, expect } from 'vitest';
import request from 'supertest'
import app from './index'

// This file can be used to write backend unit tests

// I've written this example, but we should make at least one for every backend requirement.

// If you want to test new files in the future, any *.test.js file should be tested when you run `npm run test`.

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