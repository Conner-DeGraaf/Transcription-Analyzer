import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import react from 'eslint-plugin-react';

export default defineConfig([
  globalIgnores(["docs/**"]),
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: { react },
    settings: {
      react: { version: 'detect' },   // fixes the warning
    },
    rules: {
      ...react.configs.flat['jsx-runtime'].rules, // turns off react-in-jsx-scope
    },
  },
]);
