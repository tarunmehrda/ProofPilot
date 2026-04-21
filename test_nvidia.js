import https from 'https';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.NVIDIA_API_KEY;

const systemPrompt = `You are an AI legal and complaint assistant. Respond with ONLY valid JSON and no other text.
{
  "result": "success"
}`;

const payload = JSON.stringify({
  model: "meta/llama-3.1-70b-instruct",
  messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Test" }
  ],
  temperature: 0.3,
  max_tokens: 100,
  response_format: { type: "json_object" }
});

const req = https.request('https://integrate.api.nvidia.com/v1/chat/completions', {
  method: 'POST',
  headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
  }
}, (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('Response:', data));
});
req.on('error', console.error);
req.write(payload);
req.end();
