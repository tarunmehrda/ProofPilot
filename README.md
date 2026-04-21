# ProofPilot

Turn your proof into action. Upload evidence (images, PDFs, text) and get a complete complaint package in seconds.

## Environment Note

> **Note to User:** Since this project is being run in the AI Studio environment which enforce specific constraints (a Node.js container, and strictly exposing only port 3000), the requested Python FastAPI backend has been ported directly to an Express.js Full-Stack Application using TypeScript.

This Express server handles text extraction identically (using \`tesseract.js\` for images, \`pdf-parse\` for PDFs), forwards the extracted data to the NVIDIA API, and returns an automatically generated \`pdfkit\` document, all operating under the single exposed Node server on port 3000.

## Setup

1. Copy `.env.example` to `.env` and configure your `NVIDIA_API_KEY`.
2. Access the front-end directly via the preview! 
