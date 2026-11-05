import { describe, it, expect } from 'vitest';
import request from 'supertest'
import app from './index'
import { parseDNAFromFASTA } from './parse-dna'

describe('parseDNAFromFASTA', () => {
    describe("FR-02", () => {
        it('Should error on empty sequence.', () => {
            expect(() => parseDNAFromFASTA('',"5'->3'")).toThrow();
        });
        
        it('Parses DNA on the line after the header', () => {
            expect(parseDNAFromFASTA('> TESTHEADER\nTAC',"5'->3'")).toBe("TAC");
        });
        it('Handles headers not on the first line.', () => {
            expect(parseDNAFromFASTA('\n\t \n> TESTHEADER\nTAC',"5'->3'")).toBe("TAC");
            expect(parseDNAFromFASTA('\n \n> TESTHEADER\nAAA',"5'->3'")).toBe("AAA");
            expect(parseDNAFromFASTA('\n   \n  \n> TESTHEADER\nGGG',"5'->3'")).toBe("GGG");
        });
        it('Uses the first sequence', () => {
            expect(parseDNAFromFASTA('> TESTHEADER\nTAC\n> TESTHEADER2\nGAG',"5'->3'")).toBe("TAC");
        });
        
        it('Uses the first sequence', () => {
            expect(parseDNAFromFASTA('> TESTHEADER\nTAC\n> TESTHEADER2\nGAG',"5'->3'")).toBe("TAC");
        });
        it('Reverses the string on direction 3\'->5\'', () => {
            expect(parseDNAFromFASTA('> TESTHEADER\nTAC',"3'->5'")).toBe("CAT");
        })
    })
}
);