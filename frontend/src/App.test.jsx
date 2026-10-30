// @vitest-environment jsdom

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App.jsx';

// This file can be used to write frontend unit tests

// I've written this example, but we should make at least one for every frontend requirement.

// If you want to test new files in the future, any *.test.jsx file should be tested when you run `npm run test`.

describe('App Component', () => {
  it('disables the analyze button when no file is selected', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /Run Analysis/i });
    expect(button).toBeDisabled();
  });

  it('enables the button after selecting a file', () => {
    render(<App />);
    const input = screen.getByLabelText('Upload FASTA file', { hidden: true }); // the file input. Make sure to update this if you change the label
    const button = screen.getByRole('button', { name: /Run Analysis/i });

    const dummyFile = new File(['ATCG'], 'dna.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [dummyFile] } });

    expect(button).not.toBeDisabled();
  });
});