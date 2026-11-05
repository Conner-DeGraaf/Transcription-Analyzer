// @vitest-environment jsdom

import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// This file can be used to write frontend unit tests

// I've written this example, but we should make at least one for every frontend requirement.

// If you want to test new files in the future, any *.test.jsx file should be tested when you run `npm run test`.

function getDummyFile(): File
{
  return new File(['> TESTHEADER\nATCG'], 'dna.fasta', { type: 'text/plain' });
}

describe('App Component', () => {
  describe("FR-01", () => {
    it('disables the analyze button when no file is selected', () => {
      render(<App />);
      const button = screen.getByRole('button', { name: /Run Analysis/i });
      expect(button).toBeDisabled();
    });

    it('enables the button after selecting a file', () => {
      render(<App />);
      const input = screen.getByLabelText('Upload FASTA file'); // the file input. Make sure to update this if you change the label
      const button = screen.getByRole('button', { name: /Run Analysis/i });

      const dummyFile = getDummyFile();
      fireEvent.change(input, { target: { files: [dummyFile] } });
      expect(button).not.toBeDisabled();
    });
    
  })
  describe("FR-26", () =>
  {
    it('DNA Analysis can be requested', async () =>
    {
      const user = userEvent.setup();
      const postSpy = vi.spyOn(axios, 'post').mockResolvedValue({ data: {} });

      render(<App />);
      const input = screen.getByLabelText('Upload FASTA file'); // the file input. Make sure to update this if you change the label
      const button = screen.getByRole('button', { name: /Run Analysis/i });
      
      const dummyFile = getDummyFile();
      fireEvent.change(input, { target: { files: [dummyFile] } });

      await user.click(button);

      const formData = new FormData();
      formData.append('file', dummyFile);
      formData.append('direction', "5'->3'");
      expect(postSpy).toHaveBeenCalledWith('http://localhost:3420/api/analyze', formData)
    })
  })
  // TODO: FR27-29

  // TODO: Implement this when the front end fully displays the RNA URL:
  /*describe("FR-37", () => {
    // The Transcription Analyzer SHALL be able to hand the generated file to the browser for download when file generation completes.
  })*/
});