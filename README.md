<div align="center">

<!-- 3D Animated Header -->
<img src="https://capsule-render.vercel.app/api?type=venom&color=0:0f0c29,40:302b63,100:7c3aed&height=220&section=header&text=ProofPilot&fontSize=80&fontColor=ffffff&fontAlignY=40&desc=%E2%9A%A1%20Turn%20your%20proof%20into%20action%20%E2%9A%A1&descAlignY=62&descSize=20&descColor=e879f9&animation=fadeIn&stroke=7c3aed&strokeWidth=2" width="100%"/>

<br/>

<!-- Hackathon Trophy Banner -->
<img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=900&size=18&pause=800&color=FFD700&center=true&vCenter=true&width=700&lines=%F0%9F%8F%86+HACKATHON+PROJECT+%F0%9F%8F%86;Built+in+hours.+Solving+real+problems.;%E2%9A%A1+Evidence+IN+%E2%80%A2+Complaint+OUT+%E2%80%A2+Instant.;Powered+by+NVIDIA+AI+%2B+Tesseract+OCR+%2B+pdfkit;One+upload.+One+click.+One+complaint+package." alt="Typing SVG" />

<br/><br/>

<!-- Hackathon Badge Row -->
<img src="https://img.shields.io/badge/%F0%9F%8F%86-HACKATHON%20BUILD-FFD700?style=for-the-badge&labelColor=1a0533"/>
<img src="https://img.shields.io/badge/%E2%9A%A1-BUILT%20IN%2048H-ff6b35?style=for-the-badge&labelColor=1a0533"/>
<img src="https://img.shields.io/badge/%F0%9F%A4%96-AI%20POWERED-7c3aed?style=for-the-badge&labelColor=1a0533"/>

<br/><br/>

<!-- Tech Badges -->
<p>
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/NVIDIA-76B900?style=for-the-badge&logo=nvidia&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tesseract.js-00B4D8?style=for-the-badge&logoColor=white"/>
  <img src="https://img.shields.io/badge/pdfkit-FF0000?style=for-the-badge&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/License-MIT-blueviolet?style=flat-square"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square"/>
  <img src="https://img.shields.io/badge/Port-3000-orange?style=flat-square"/>
  <img src="https://img.shields.io/badge/Status-🔥 Live-success?style=flat-square"/>
</p>

</div>

---

## 🏆 Hackathon Story

<table>
<tr>
<td width="60%">

### The Problem We Solved

Every day, thousands of people face injustice — defective products, unfair services, workplace violations — but **writing a formal complaint is hard, time-consuming, and often intimidating.**

Most people give up. Evidence sits unused. Cases go unfiled.

**ProofPilot changes that.**

Upload your proof. Get a complete, professional complaint package — **in seconds, not hours.**

</td>
<td width="40%" align="center">

```
  ┌─────────────────────┐
  │  😤  The Problem    │
  │                     │
  │  Evidence exists    │
  │  but complaints     │
  │  never get filed    │
  │                     │
  │  ↓  ProofPilot  ↓   │
  │                     │
  │  📁 Upload Proof    │
  │  🤖 AI Processes    │
  │  📄 Get Complaint   │
  └─────────────────────┘
```

</td>
</tr>
</table>

---

## ✦ What is ProofPilot?

> **ProofPilot** is an AI-powered complaint package generator — built at a hackathon to make justice accessible to everyone.

Upload your evidence (images, PDFs, or text), and ProofPilot:
1. **Extracts** all text using OCR and PDF parsing
2. **Analyzes** the content with NVIDIA AI
3. **Drafts** a complete, formal complaint document
4. **Delivers** a ready-to-send PDF — instantly

No legal knowledge needed. No expensive lawyers. Just upload and go.

---

## ⚡ Features

| | Feature | Description |
|---|---|---|
| 🖼️ | **Image OCR** | Extracts text from photos/screenshots via `tesseract.js` |
| 📄 | **PDF Parsing** | Reads & parses PDF evidence using `pdf-parse` |
| 🤖 | **AI Drafting** | Intelligent complaint generation via NVIDIA API |
| 📝 | **PDF Output** | Polished, formatted complaint document via `pdfkit` |
| 🔌 | **Single Server** | Everything on one Express server — zero config |
| ⚡ | **Instant** | Evidence in → Complaint out in seconds |

---

## 🎯 Demo Flow

```
 YOU                          PROOFPILOT
  │                               │
  │  📎 Upload evidence            │
  │ ─────────────────────────────▶ │
  │                               │ 🔍 OCR / PDF parse
  │                               │ 🤖 NVIDIA AI draft
  │                               │ 📝 Build PDF
  │  📄 Download complaint        │
  │ ◀───────────────────────────── │
  │                               │
  ▼                               ▼
Done in seconds ⚡              Zero friction 🎯
```

---

## 🗂️ Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  ⚡  ProofPilot  ⚡                       │
│                                                          │
│   ┌──────────┐     ┌────────────────────┐               │
│   │  Upload  │────▶│   Text Extraction  │               │
│   │  (UI)    │     │  ┌──────────────┐  │               │
│   └──────────┘     │  │ tesseract.js │  │  (images)     │
│                    │  │  pdf-parse   │  │  (PDFs)       │
│                    │  │  plain text  │  │  (text)       │
│                    │  └──────────────┘  │               │
│                    └────────┬───────────┘               │
│                             │                           │
│                    ┌────────▼───────────┐               │
│                    │    NVIDIA API      │               │
│                    │  AI Complaint      │               │
│                    │  Generation        │               │
│                    └────────┬───────────┘               │
│                             │                           │
│                    ┌────────▼───────────┐               │
│                    │      pdfkit        │               │
│                    │  PDF Generation    │               │
│                    │  & Download        │               │
│                    └────────────────────┘               │
│                                                         │
│              All on Express · Port 3000                 │
└──────────────────────────────────────────────────────────┘
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

Open `.env` and set your NVIDIA API key:

```env
NVIDIA_API_KEY=your_nvidia_api_key_here
PORT=3000
```

### 4. Run the app

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** and start uploading evidence! 🎉

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Why We Chose It |
|---|---|---|
| **Runtime** | Node.js | Fast, hackathon-friendly |
| **Language** | TypeScript | Type safety under pressure |
| **Server** | Express.js | Minimal, battle-tested |
| **OCR** | tesseract.js | Browser + server OCR, no Python needed |
| **PDF Read** | pdf-parse | Reliable PDF text extraction |
| **AI Brain** | NVIDIA API | Powerful LLM inference |
| **PDF Write** | pdfkit | Polished output documents |

</div>

---

## 📁 Project Structure

```
proofpilot/
├── src/
│   ├── index.ts             # Express entry point
│   ├── routes/
│   │   └── upload.ts        # Upload & processing route
│   ├── services/
│   │   ├── ocr.ts           # tesseract.js OCR service
│   │   ├── pdfReader.ts     # pdf-parse service
│   │   ├── nvidia.ts        # NVIDIA API integration
│   │   └── pdfWriter.ts     # pdfkit PDF generation
│   └── types/
│       └── index.ts         # Shared TypeScript types
├── public/                  # Frontend (HTML/CSS/JS)
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

> This project was built for an **AI Studio / containerized environment** constrained to a Node.js container with only port 3000 exposed.
>
> The originally planned Python FastAPI backend was **fully ported to Express.js + TypeScript**, maintaining identical functionality:
> - `tesseract.js` → replaces Python Tesseract OCR
> - `pdf-parse` → replaces PyMuPDF / pdfplumber
> - `pdfkit` → replaces ReportLab / WeasyPrint
> - Single Express server on port `3000`

---

## 👥 Team

<div align="center">

| Role | Who |
|---|---|
| 💻 Full-Stack Dev | [@your-username](https://github.com/your-username) |
| 🤖 AI Integration | [@teammate](https://github.com/teammate) |
| 🎨 UI/UX | [@teammate](https://github.com/teammate) |

*Built with ☕ caffeine, 🔥 passion, and very little sleep at **[Hackathon Name]***

</div>

---

## 🤝 Contributing

Contributions are welcome — especially from fellow hackers!

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push & open a PR 🚀

---

## 📄 License

MIT © [Your Name](https://github.com/your-username)

---

<div align="center">

<br/>

### ⭐ If ProofPilot helped you or inspired you, drop a star — it means the world to a hackathon team!

<br/>

<img src="https://img.shields.io/github/stars/your-username/proofpilot?style=social"/>
&nbsp;&nbsp;
<img src="https://img.shields.io/github/forks/your-username/proofpilot?style=social"/>
&nbsp;&nbsp;
<img src="https://img.shields.io/github/watchers/your-username/proofpilot?style=social"/>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:7c3aed&height=140&section=footer&text=Made%20with%20%F0%9F%94%A5%20at%20a%20Hackathon&fontSize=24&fontColor=e879f9&animation=fadeIn&fontAlignY=65" width="100%"/>

</div>
