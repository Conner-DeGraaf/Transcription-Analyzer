import { describe, it, expect } from 'vitest';
import { transcribeCodingDNA, transcribeTemplateDNA } from './transcription';

describe('DNA transcription', () => {

    it('Converts coding DNA to mRNA', () => {
        expect(transcribeCodingDNA('ATGC')).toBe('AUGC');
    });

    it('Handles lowercase coding DNA', () => {
        expect(transcribeCodingDNA('atgc')).toBe('AUGC');
    });

    it('Transcribes a template written 3 to 5', () => {
        expect(transcribeTemplateDNA('TACG')).toBe('CGUA');
    });

    it('Handle lowercase template DNA', () => {
        expect(transcribeTemplateDNA('tacg')).toBe('CGUA');
    });
})



