<div align="center">

<!-- 3D Animated Header -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f0c29,50:302b63,100:24243e&height=200&section=header&text=ProofPilot&fontSize=72&fontColor=ffffff&fontAlignY=38&desc=Turn%20your%20proof%20into%20action.&descAlignY=62&descSize=20&descColor=a78bfa&animation=fadeIn" width="100%"/>

<!-- Animated Badge Row -->
<p>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/NVIDIA-76B900?style=for-the-badge&logo=nvidia&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tesseract.js-00B4D8?style=for-the-badge&logo=data:image/png;base64,&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/License-MIT-blueviolet?style=flat-square"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square"/>
  <img src="https://img.shields.io/badge/Port-3000-orange?style=flat-square"/>
  <img src="https://img.shields.io/badge/Status-Active-success?style=flat-square"/>
</p>

<br/>

<!-- Animated Text Banner -->
<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=22&pause=1000&color=A78BFA&center=true&vCenter=true&width=600&lines=Upload+evidence.+Get+a+complaint+package.;Images+%E2%80%A2+PDFs+%E2%80%A2+Text+%E2%80%A2+All+supported.;Powered+by+NVIDIA+AI+%2B+Tesseract+OCR;One+server.+Zero+friction." alt="Typing SVG" />

</div>

---

## ✦ What is ProofPilot?

> **ProofPilot** is an AI-powered complaint generator. Upload your evidence — images, PDFs, or plain text — and receive a fully formatted, professional complaint package in seconds.

Built as a **full-stack Express.js + TypeScript** application, ProofPilot extracts text from your evidence using OCR and PDF parsing, sends it through the NVIDIA AI API for intelligent complaint drafting, and returns a polished **PDF document** — all from a single server.

---

## ⚡ Features

| Feature | Description |
|---|---|
| 🖼️ **Image OCR** | Extracts text from uploaded images via `tesseract.js` |
| 📄 **PDF Parsing** | Reads and parses PDF evidence using `pdf-parse` |
| 🤖 **AI Drafting** | Sends extracted content to NVIDIA API for complaint generation |
| 📝 **PDF Output** | Returns a complete, formatted complaint document via `pdfkit` |
| 🔌 **Single Server** | Everything runs on one Express server — port `3000` |

---

## 🗂️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                     ProofPilot                      │
│                                                     │
│   ┌──────────┐     ┌───────────────┐                │
│   │  Upload  │────▶│  Text Extract │                │
│   │  (UI)    │     │  tesseract.js │                │
│   └──────────┘     │  pdf-parse    │                │
│                    └──────┬────────┘                │
│                           │                         │
│                    ┌──────▼────────┐                │
│                    │  NVIDIA API   │                │
│                    │  (AI Draft)   │                │
│                    └──────┬────────┘                │
│                           │                         │
│                    ┌──────▼────────┐                │
│                    │  pdfkit       │                │
│                    │  (PDF Output) │                │
│                    └───────────────┘                │
└─────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-username/proofpilot.git
cd proofpilot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Open `.env` and add your NVIDIA API key:

```env
NVIDIA_API_KEY=your_nvidia_api_key_here
PORT=3000
```

### 4. Run the app

```bash
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)** 🎉

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Language** | TypeScript |
| **Server** | Express.js |
| **OCR** | tesseract.js |
| **PDF Read** | pdf-parse |
| **AI** | NVIDIA API |
| **PDF Write** | pdfkit |

</div>

---

## 📁 Project Structure

```
proofpilot/
├── src/
│   ├── index.ts          # Express entry point
│   ├── routes/
│   │   └── upload.ts     # Upload & processing route
│   ├── services/
│   │   ├── ocr.ts        # tesseract.js OCR service
│   │   ├── pdfReader.ts  # pdf-parse service
│   │   ├── nvidia.ts     # NVIDIA API integration
│   │   └── pdfWriter.ts  # pdfkit PDF generation
│   └── types/
│       └── index.ts      # Shared TypeScript types
├── public/               # Frontend (HTML/CSS/JS)
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NVIDIA_API_KEY` | ✅ | Your NVIDIA API key |
| `PORT` | ❌ | Server port (default: `3000`) |

---

## ⚠️ Environment Note

> This project was designed for an **AI Studio / containerized environment** which constrains the stack to a **Node.js container exposing only port 3000**.
>
> The originally planned Python FastAPI backend has been **fully ported to Express.js + TypeScript**, maintaining identical functionality:
> - `tesseract.js` replaces Python Tesseract OCR
> - `pdf-parse` replaces PyMuPDF / pdfplumber
> - `pdfkit` replaces ReportLab / WeasyPrint
> - All logic runs under the single Express server on port `3000`

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push and open a PR

---

## 📄 License

MIT © [Your Name](https://github.com/your-username)

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:0f0c29&height=120&section=footer&animation=fadeIn" width="100%"/>

<sub>Built with 💜 using Express · TypeScript · NVIDIA AI</sub>

</div>
