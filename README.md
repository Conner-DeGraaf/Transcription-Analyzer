# Summary
A transcription Analyzer for CIS 350 Software Engineering. Takes in a FASTA file and allows you to do basic DNA analysis and conversion to mRNA.

# How To Set Up Localy

### 1. Clone the repo

```bash
git clone git@github.com:Conner-DeGraaf/Transcription-Analyzer.git
```

### 2. If you don't have node.js installed run this command in your shell.

```bash
winget install CoreyButler.NVMforWindows
```
Then restart your terminal and run
```bash
nvm install lts
nvm use lts
```
<sub>If you are using linux I assume you know how to setup node.</sub>
<sub>[Alternativly download it from the website.](https://nodejs.org/en/download)</sub>

### 3. Run this command in the root directory of the project to install all of the packages.


```bash
npm install; cd ./backend; npm install; cd ../frontend; npm install
```

<sub>Use && instead of ; as a seperator if you are on linux/bash.</sub>
<sub>If node or npm is not recognized make sure you restarted your terminal after the last step.</sub>

### 4. Start the development server at any time via this command.

You don't need to restart the server when you change files as the server will hot reload them. Running this command will start both the backend (express) and the front end (react)

```bash
npm run dev
```

It will now be accessable in your browser at http://localhost:5173
If you get module not found make sure you ran npm install in all three directories.