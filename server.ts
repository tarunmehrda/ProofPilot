import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createWorker } from 'tesseract.js';
import { PDFParse } from 'pdf-parse';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: 'uploads/' });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.post('/api/upload', (req, res, next) => {
    upload.array('files')(req, res, (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(400).json({ error: "File upload error: " + err.message });
      }
      next();
    });
  }, async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded.' });
      }

      let extracted_text = '';

      for (const file of files) {
        const filePath = file.path;
        const mimeType = file.mimetype;

        try {
          if (mimeType.startsWith('image/')) {
            const worker = await createWorker('eng');
            const ret = await worker.recognize(filePath);
            extracted_text += ret.data.text + '\n\n';
            await worker.terminate();
          } else if (mimeType === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const parser = new PDFParse({ data: dataBuffer });
            const data = await parser.getText();
            extracted_text += data.text + '\n\n';
          } else if (mimeType === 'text/plain' || file.originalname.endsWith('.txt')) {
            const content = fs.readFileSync(filePath, 'utf-8');
            extracted_text += content + '\n\n';
          } else {
            extracted_text += `[Unsupported file type: ${file.originalname}]\n\n`;
          }
        } catch (err: any) {
             extracted_text += `[Error extracting from ${file.originalname}: ${err.message}]\n\n`;
        } finally {
             // Cleanup file
             if (fs.existsSync(filePath)) {
               fs.unlinkSync(filePath);
             }
        }
      }

      res.json({ extracted_text });
    } catch (err: any) {
      console.error("Upload route error:", err);
      res.status(500).json({ error: 'Error processing files: ' + err.message });
    }
  });

  app.post('/api/analyze', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
          return res.status(400).json({ error: 'No text provided.' });
      }

      const apiKey = process.env.NVIDIA_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'NVIDIA_API_KEY is not configured.' });
      }

      const systemPrompt = `You are an advanced futuristic AI legal and investigation assistant (ProofPilot V2). Analyze the evidence ruthlessly like a top-tier investigator. Output ONLY valid JSON matching this exact schema:
{
  "summary": "Clear 3-5 sentence summary",
  "timeline": [{"event": "Description", "date": "Date if any"}],
  "complaint_email": "Subject: ...\\n\\nDear...",
  "legal_notice": "NOTICE OF ...\\n\\n...",
  "next_steps": ["Step 1", "Step 2"],
  "entities": { "names": ["Name"], "dates": ["Date"], "amounts": ["Amount"] },
  "classification": { "type": "Category", "tags": ["tag1", "tag2"] },
  "severity": { "level": "Low" | "Medium" | "High", "confidence": 0.95 },
  "judge_simulation": { "strength": "Strong" | "Weak" | "Moderate", "chance_of_success_pct": 85, "reasoning": "Judge simulation reasoning" },
  "opponent_predictor": { "likely_reply": "What they will say", "counter_strategy": "How to respond" },
  "negotiation_strategy": { "offer": "Suggested settlement", "escalation_threat": "If they refuse" },
  "reverse_investigation": { "scam_probability_pct": 20, "detected_patterns": ["Pattern 1"] },
  "urgency": { "alert": "Act within 48 hours", "reason": "Why" },
  "scenarios": [{ "action": "Wait", "prediction": "Outcome" }, { "action": "Escalate Legally", "prediction": "Outcome" }],
  "sms_summary": "Short SMS summary",
  "voice_script": "A dramatic 2 sentence script summarizing the case risks, starting with 'Intelligence analysis complete.'"
}`;

      const payload = {
        model: "meta/llama-3.1-70b-instruct",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
        ],
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: "json_object" }
      };

      const nvidiaRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!nvidiaRes.ok) {
        const errText = await nvidiaRes.text();
        throw new Error(`NVIDIA API Error: ${nvidiaRes.status} ${errText}`);
      }

      const nvidiaData = await nvidiaRes.json();
      const aiResponseText = nvidiaData.choices[0]?.message?.content || "{}";
      
      const parsedResults = JSON.parse(aiResponseText);
      parsedResults.extractedText = text; // embed the raw text for the highlight viewer
      
      res.json(parsedResults);
    } catch (err: any) {
       console.error("Analyze error:", err);
       res.status(500).json({ error: 'Analysis failed: ' + err.message });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { text, history, message } = req.body;
      if (!message || !text) {
        return res.status(400).json({ error: 'Missing message or evidence text.' });
      }

      const apiKey = process.env.NVIDIA_API_KEY;
      if (!apiKey) return res.status(500).json({ error: 'NVIDIA API Key missing' });

      const messages = [
        { role: 'system', content: `You are answering questions about this specific legal case evidence:\n\nEVIDENCE TRUTH:\n${text}\n\nAnswer the user clearly based ONLY on the evidence provided.` },
        ...(history || []),
        { role: 'user', content: message }
      ];

      const payload = {
        model: "meta/llama-3.1-70b-instruct",
        messages,
        temperature: 0.3,
        max_tokens: 1000
      };

      const nvidiaRes = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!nvidiaRes.ok) throw new Error(await nvidiaRes.text());
      const nvidiaData = await nvidiaRes.json();
      res.json({ reply: nvidiaData.choices[0]?.message?.content || '' });
    } catch (err: any) {
      console.error("Chat error:", err);
      res.status(500).json({ error: 'Chat failed: ' + err.message });
    }
  });

  app.post('/api/generate-pdf', (req, res) => {
    try {
      const { summary, timeline, complaint_email, legal_notice, next_steps } = req.body;

      const doc = new PDFDocument();
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="complaint_report.pdf"');

      doc.pipe(res);

      doc.fontSize(24).text('ProofPilot — Complaint Report', { align: 'center' });
      doc.moveDown();

      const addSection = (title: string, content: string) => {
          doc.fontSize(16).text(title, { underline: true });
          doc.moveDown(0.5);
          doc.fontSize(12).text(content || 'Not provided');
          doc.moveDown(1.5);
      };

      addSection('SUMMARY', summary);
      addSection('TIMELINE', timeline);
      addSection('COMPLAINT EMAIL', complaint_email);
      addSection('LEGAL NOTICE', legal_notice);
      addSection('NEXT STEPS', next_steps);

      doc.end();
    } catch (err: any) {
      console.error("Generate PDF error:", err);
      // If we already piped, setting headers might fail, but this is a fallback
      if (!res.headersSent) {
          res.status(500).json({ error: 'PDF generation failed: ' + err.message });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  // Global Error Handler to prevent HTML stack traces
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Global Express Error:", err);
    res.status(500).json({ error: 'Internal server error: ' + err.message });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
