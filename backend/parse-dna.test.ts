import { describe, it, expect } from 'vitest';
import request from 'supertest'
import app from './index'
import { parseDNAFromFASTA } from './parse-dna'

describe('parseDNAFromFASTA', () => {
    describe("FR-02", () => {
        it('Should error on empty sequence.', async () => {
            expect(() => parseDNAFromFASTA('')).toThrow();
        });
        
        it('Parses DNA on the line after the header', async () => {
            expect(parseDNAFromFASTA('> TESTHEADER\nTAC')).toBe("TAC");
        });
        it('Handles headers not on the first line.', async () => {
            expect(parseDNAFromFASTA('\n\t \n> TESTHEADER\nTAC')).toBe("TAC");
            expect(parseDNAFromFASTA('\n \n> TESTHEADER\nAAA')).toBe("AAA");
            expect(parseDNAFromFASTA('\n   \n  \n> TESTHEADER\nGGG')).toBe("GGG");
        });
        it('Uses the first sequence', async () => {
            expect(parseDNAFromFASTA('> TESTHEADER\nTAC\n> TESTHEADER2\nGAG')).toBe("TAC");
        });
    })
}
);