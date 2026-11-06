import { describe, expect, it } from 'vitest';
import { isNotValidDNASequence, isNotValidFastaFormat } from './validation';


function fastaFile(originalname: string, contents: string): Express.Multer.File {
    return {
        originalname,
        buffer: Buffer.from(contents)
    } as Express.Multer.File;
}


describe('Validation Functions', () => {
    describe('FR-05', () => {
        it('Should accept only .fasta, .fa, .fna, .ffn, or .fa', () => {
            expect(isNotValidFastaFormat(fastaFile('sequence.fa', '>sample\nACGT'))).toBe(false);
            expect(isNotValidFastaFormat(fastaFile('sequence.fna', '>sample\nACGT'))).toBe(false);
            expect(isNotValidFastaFormat(fastaFile('sequence.ffn', '>sample\nACGT'))).toBe(false);
            expect(isNotValidFastaFormat(fastaFile('sequence.fa', '>sample\nACGT'))).toBe(false);
            expect(isNotValidFastaFormat(fastaFile('sequence.fasta', '>sample\nACGT'))).toBe(false);
        });
        it('Should reject a missing file', () => {
            expect(isNotValidFastaFormat()).toBe(true);
        });
    });

    describe('FR-06 + FR-07 + FR-18', () => {
        it('Should reject improper fasta content', () => {
            expect(isNotValidFastaFormat(fastaFile('sequence.fa', 'ACGT'))).toBe(true);
            expect(isNotValidFastaFormat(fastaFile('sequence.fa', 'ACGT\n>one\nTGCA'))).toBe(true);
            expect(isNotValidFastaFormat(fastaFile('sequence.fa', ''))).toBe(true);
        });
        it('Should accept multiple headers with nonempty sequence data', () => {
            expect(isNotValidFastaFormat(fastaFile('sequence.fa', '>one\nACGT\n>two\nTGCA'))).toBe(false);
            expect(isNotValidFastaFormat(fastaFile('sequence.fa', '>one\nACGT\n>two\nTGCA\n>three\nCTAG'))).toBe(false);
        });
    });

    describe('FR-08', () => {
        it('Should reject the file when the extension is unsupported', () => {
            expect(isNotValidFastaFormat(fastaFile('sequence.txt', '>sample\nACGT'))).toBe(true);
            expect(isNotValidFastaFormat(fastaFile('sequence.png', '>sample\nACGT'))).toBe(true);
            expect(isNotValidFastaFormat(fastaFile('sequence.fastaa', '>sample\nACGT'))).toBe(true);
            expect(isNotValidFastaFormat(fastaFile('sequence.f', '>sample\nACGT'))).toBe(true);
        });
        it('Should reject the file when any header lacks nonempty sequence data', () => {
            expect(isNotValidFastaFormat(fastaFile('sequence.fa', '>one\n \n'))).toBe(true);
            expect(isNotValidFastaFormat(fastaFile('sequence.fa', '>one\nACGT\n>two\n'))).toBe(true);
            expect(isNotValidFastaFormat(fastaFile('sequence.fa', '>one\nACGT\n>two\nTGCA\n>three\n'))).toBe(true);
        });
    });

    describe('FR-10', () => {
        it('Should reject an empty sequence', () => {
            expect(isNotValidDNASequence('')).toBe(true);
        });
    });

    describe('FR-11', () => {
        it('Should accept AGCT uppercase and lowercase', () => {
            expect(isNotValidDNASequence('ACGT')).toBe(false);
            expect(isNotValidDNASequence('acgt')).toBe(false);
        });

        it('Should reject non-DNA characters', () => {
            expect(isNotValidDNASequence('')).toBe(true);
            expect(isNotValidDNASequence('ACGTN')).toBe(true);
            expect(isNotValidDNASequence('ACGT123')).toBe(true);
        });

        it('Should accept whitespace between bases', () => {
            expect(isNotValidDNASequence('ACG\nT')).toBe(false);
            expect(isNotValidDNASequence('ACG T')).toBe(false);
            expect(isNotValidDNASequence('ACG \tT')).toBe(false);
            expect(isNotValidDNASequence('ACG \t\t\nT\n \tTC A')).toBe(false);
        });
    });

});

