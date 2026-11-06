import { describe, it, expect } from 'vitest';

import {
    countNucleotides,
    calculateGCContent,
    analyzeDNA
} from './dnaanalysis';
import { AnalysisResult } from '../../lib/transcription-analysis_types';

//unit test for countNucleotides 

describe('countNucleotides', () => {

    it('should count each nucleotide correctly', () => {
        expect(countNucleotides("ATGC")).toEqual({
            A: 1,
            T: 1,
            C: 1,
            G: 1
        });
    });

    it('should count multiple occurrences', () => {
        expect(countNucleotides("GGCCATTA")).toEqual({
            A: 2,
            T: 2,
            C: 2,
            G: 2
        });
    });

    it('should handle lowercase DNA sequences', () => {
        expect(countNucleotides("atgc")).toEqual({
            A: 1,
            T: 1,
            C: 1,
            G: 1
        });
    });

    it('should return zero counts for an empty sequence', () => {
        expect(countNucleotides("")).toEqual({
            A: 0,
            T: 0,
            C: 0,
            G: 0
        });
    });

});

//unit test for calculateGCContent

describe('calculateGCContent', () => {

    it('should calculate G and C percentages', () => {
        expect(calculateGCContent("ATGC")).toEqual({
            guaninePercent: 25,
            cytosinePercent: 25
        });
    });

    it('should calculate different G and C percentages', () => {
        expect(calculateGCContent("GGGCCA")).toEqual({
            guaninePercent: 50,
            cytosinePercent: 33.33333333333333
        });
    });

    it('should return 100% G for a sequence of only G', () => {
        expect(calculateGCContent("GGGG")).toEqual({
            guaninePercent: 100,
            cytosinePercent: 0
        });
    });

    it('should return 100% C for a sequence of only C', () => {
        expect(calculateGCContent("CCCC")).toEqual({
            guaninePercent: 0,
            cytosinePercent: 100
        });
    });

    it('should return zero percentages for an empty sequence', () => {
        expect(calculateGCContent("")).toEqual({
            guaninePercent: 0,
            cytosinePercent: 0
        });
    });

});

describe('analyzeDNA', () => {

    it('should return the complete DNA analysis', () => {

        var expectedResult : AnalysisResult = {
            rnaDownload: "",
            RNASequence: "",
            sequenceLength: 4,
            gc: {
                guaninePercent: 25,
                cytosinePercent: 25
            }
        }
        expect(analyzeDNA("ATGC")).toEqual(expectedResult);
    });

    it('should handle an empty DNA sequence', () => {
        var expectedResult : AnalysisResult = {
            rnaDownload: "",
            RNASequence: "",
            sequenceLength: 0,
            gc: {
                guaninePercent: 0,
                cytosinePercent: 0
            }
        }
        expect(analyzeDNA("")).toEqual(expectedResult);

    });

});