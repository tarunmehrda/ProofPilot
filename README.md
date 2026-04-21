<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&color=0:0f0c29,40:302b63,100:7c3aed&height=230&section=header&text=ProofPilot&fontSize=86&fontColor=ffffff&fontAlignY=40&desc=%E2%9A%A1%20Turn%20your%20proof%20into%20action%20%E2%9A%A1&descAlignY=62&descSize=22&descColor=e879f9&animation=fadeIn&stroke=7c3aed&strokeWidth=2" width="100%"/>

<br/>

<img src="https://readme-typing-svg.demolab.com?font=Orbitron&weight=900&size=17&pause=900&color=FFD700&center=true&vCenter=true&width=750&lines=%F0%9F%8F%86+Blostem+AI+Builder+Hackathon+%F0%9F%8F%86;Backed+by+Rainmatter+%28Zerodha%29+%C2%B7+MobiKwik+%C2%B7+AC+Ventures;Built+in+hours.+Solving+real+problems.;%E2%9A%A1+Evidence+IN+%E2%80%94+Complaint+OUT+%E2%80%94+Instant.;One+upload.+One+click.+One+complaint+package." alt="Typing SVG" />

<br/><br/>

<!-- Hackathon + Sponsor Badges -->
<img src="https://img.shields.io/badge/%F0%9F%8F%86-Blostem%20AI%20Builder%20Hackathon-FFD700?style=for-the-badge&labelColor=1a0533"/>
<img src="https://img.shields.io/badge/%E2%9A%A1-BUILT%20AT%20HACKATHON-ff6b35?style=for-the-badge&labelColor=1a0533"/>
<img src="https://img.shields.io/badge/%F0%9F%A4%96-AI%20POWERED-7c3aed?style=for-the-badge&labelColor=1a0533"/>

<br/><br/>

<img src="https://img.shields.io/badge/Backed%20by-Rainmatter%20%28Zerodha%29-brightgreen?style=flat-square&logo=zerodha&logoColor=white"/>
<img src="https://img.shields.io/badge/Backed%20by-MobiKwik-0066CC?style=flat-square&logoColor=white"/>
<img src="https://img.shields.io/badge/Backed%20by-AC%20Ventures-FF4500?style=flat-square&logoColor=white"/>

<br/><br/>

<!-- Tech Stack Badges -->
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/NVIDIA-76B900?style=for-the-badge&logo=nvidia&logoColor=white"/>
<img src="https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white"/>

<br/><br/>

<img src="https://img.shields.io/badge/🌐 Live Demo-proofpilot.netlify.app-7c3aed?style=for-the-badge"/>
<img src="https://img.shields.io/badge/License-MIT-blueviolet?style=flat-square"/>
<img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square"/>
<img src="https://img.shields.io/badge/Status-🔥 Live-success?style=flat-square"/>

<br/><br/>

### 🌐 [**Try it live → proofpilot.netlify.app**](https://proofpilot.netlify.app/)

</div>

---

## 🏆 Built at Blostem AI Builder Hackathon

<div align="center">

> *Backed by* **Rainmatter (Zerodha)** · **MobiKwik** · **AC Ventures**

</div>

<table>
<tr>
<td width="58%">

### 💡 The Problem We Solved

Every day, thousands of people face injustice — defective products, unfair services, workplace violations — but **writing a formal complaint is hard, time-consuming, and intimidating.**

Most people give up. Evidence sits unused. Cases go unfiled.

**ProofPilot changes that.**

Upload your proof. Get a complete, professional complaint package — **in seconds, not hours.**

> Built under hackathon pressure. Shipped with purpose. 🚀

</td>
<td width="42%" align="center">

```
  ┌─────────────────────────┐
  │   😤  The Problem       │
  │                         │
  │  Evidence exists but    │
  │  complaints never       │
  │  get filed              │
  │                         │
  │    ↓  ProofPilot  ↓     │
  │                         │
  │  📁 Upload your proof   │
  │  🤖 AI processes it     │
  │  📄 Complaint ready     │
  │  ✅ Justice served      │
  └─────────────────────────┘
```

</td>
</tr>
</table>

---

## ✦ What is ProofPilot?

> **ProofPilot** is an AI-powered complaint package generator — built at the **Blostem AI Builder Hackathon** to make justice accessible to everyone.

Upload your evidence (images, PDFs, or text), and ProofPilot:

1. 🔍 **Extracts** all text using OCR and PDF parsing
2. 🤖 **Analyzes** the content with NVIDIA AI
3. ✍️ **Drafts** a complete, formal complaint document
4. 📄 **Delivers** a ready-to-send PDF — instantly

No legal knowledge. No expensive lawyers. Just upload and go.

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
| 🌐 | **Live on Netlify** | Deployed & accessible at [proofpilot.netlify.app](https://proofpilot.netlify.app/) |

---

## 🎯 Demo Flow

```
 YOU                              PROOFPILOT
  │                                   │
  │   📎 Upload evidence               │
  │ ─────────────────────────────────▶ │
  │                                   │ 🔍 OCR / PDF parse
  │                                   │ 🤖 NVIDIA AI draft
  │                                   │ 📝 Build complaint
  │   📄 Download complaint           │
  │ ◀───────────────────────────────── │
  │                                   │
  ▼                                   ▼
Done in seconds ⚡               Zero friction 🎯
```

---

## 🗂️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    ⚡  ProofPilot  ⚡                       │
│                                                            │
│   ┌──────────┐      ┌─────────────────────┐               │
│   │  Upload  │─────▶│    Text Extraction   │               │
│   │  (UI)    │      │  ┌───────────────┐  │               │
│   └──────────┘      │  │ tesseract.js  │  │  ← images     │
│                     │  │  pdf-parse    │  │  ← PDFs       │
│                     │  │  plain text   │  │  ← text       │
│                     │  └───────────────┘  │               │
│                     └────────┬────────────┘               │
│                              │                            │
│                     ┌────────▼────────────┐               │
│                     │     NVIDIA API      │               │
│                     │  AI Complaint       │               │
│                     │  Generation         │               │
│                     └────────┬────────────┘               │
│                              │                            │
│                     ┌────────▼────────────┐               │
│                     │       pdfkit        │               │
│                     │   PDF Generation    │               │
│                     └─────────────────────┘               │
│                                                           │
│           All on Express · Port 3000 · Netlify            │
└────────────────────────────────────────────────────────────┘
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

Add your NVIDIA API key to `.env`:

```env
NVIDIA_API_KEY=your_nvidia_api_key_here
PORT=3000
```

### 4. Run the app

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** 🎉  
Or visit the live version at **[proofpilot.netlify.app](https://proofpilot.netlify.app/)** 🌐

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Why We Chose It |
|---|---|---|
| **Runtime** | Node.js | Fast, hackathon-friendly |
| **Language** | TypeScript | Type safety under pressure |
| **Server** | Express.js | Minimal, battle-tested |
| **OCR** | tesseract.js | No Python needed — pure JS OCR |
| **PDF Read** | pdf-parse | Reliable PDF text extraction |
| **AI Brain** | NVIDIA API | Powerful LLM inference |
| **PDF Write** | pdfkit | Polished output documents |
| **Hosting** | Netlify | Zero-friction deployment |

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

> Built for an **AI Studio / containerized environment** constrained to Node.js with only port 3000 exposed.
>
> The originally planned Python FastAPI backend was **fully ported to Express.js + TypeScript**:
> - `tesseract.js` → replaces Python Tesseract OCR
> - `pdf-parse` → replaces PyMuPDF / pdfplumber
> - `pdfkit` → replaces ReportLab / WeasyPrint

---

## 👥 Team

<div align="center">

| Role | Who |
|---|---|
| 💻 Full-Stack Dev | [@your-username](https://github.com/your-username) |
| 🤖 AI Integration | [@teammate](https://github.com/teammate) |
| 🎨 UI/UX | [@teammate](https://github.com/teammate) |

*Built with ☕ caffeine, 🔥 passion & zero sleep at the **Blostem AI Builder Hackathon***  
*Backed by **Rainmatter (Zerodha) · MobiKwik · AC Ventures***

</div>

---

## 🤝 Contributing

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

### ⭐ If ProofPilot inspired you, drop a star — it means the world to a hackathon team!

<br/>

<img src="https://img.shields.io/github/stars/your-username/proofpilot?style=social"/>
&nbsp;&nbsp;
<img src="https://img.shields.io/github/forks/your-username/proofpilot?style=social"/>
&nbsp;&nbsp;
<img src="https://img.shields.io/github/watchers/your-username/proofpilot?style=social"/>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:24243e,50:302b63,100:7c3aed&height=150&section=footer&text=Made%20with%20%F0%9F%94%A5%20at%20Blostem%20AI%20Builder%20Hackathon&fontSize=20&fontColor=e879f9&animation=fadeIn&fontAlignY=65" width="100%"/>

</div>
