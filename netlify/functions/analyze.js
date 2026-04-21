exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'NVIDIA_API_KEY is not configured.' }) };
  }

  let body;
  try { body = JSON.parse(event.body); } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body.' }) };
  }

  const { text } = body;
  if (!text) return { statusCode: 400, body: JSON.stringify({ error: 'No text provided.' }) };

  const systemPrompt = `You are an advanced futuristic AI legal and investigation assistant (ProofPilot V2). Analyze the evidence ruthlessly like a top-tier investigator. Output ONLY valid JSON matching this exact schema:
{
  "summary": "Clear 3-5 sentence summary",
  "timeline": [{"event": "Description", "date": "Date if any"}],
  "complaint_email": "Subject: ...\\n\\nDear...",
  "legal_notice": "NOTICE OF ...\\n\\n...",
  "next_steps": ["Step 1", "Step 2"],
  "entities": { "names": ["Name"], "dates": ["Date"], "amounts": ["Amount"] },
  "classification": { "type": "Category", "tags": ["tag1", "tag2"] },
  "severity": { "level": "Low", "confidence": 0.95 },
  "judge_simulation": { "strength": "Strong", "chance_of_success_pct": 85, "reasoning": "Judge simulation reasoning" },
  "opponent_predictor": { "likely_reply": "What they will say", "counter_strategy": "How to respond" },
  "negotiation_strategy": { "offer": "Suggested settlement", "escalation_threat": "If they refuse" },
  "reverse_investigation": { "scam_probability_pct": 20, "detected_patterns": ["Pattern 1"] },
  "urgency": { "alert": "Act within 48 hours", "reason": "Why" },
  "scenarios": [{ "action": "Wait", "prediction": "Outcome" }, { "action": "Escalate Legally", "prediction": "Outcome" }],
  "sms_summary": "Short SMS summary",
  "voice_script": "A dramatic 2 sentence script summarizing the case risks, starting with 'Intelligence analysis complete.'"
}`;

  const payload = {
    model: 'meta/llama-3.1-70b-instruct',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
    temperature: 0.2,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  };

  const nvidiaRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!nvidiaRes.ok) {
    const err = await nvidiaRes.text();
    return { statusCode: 502, body: JSON.stringify({ error: `NVIDIA API Error: ${nvidiaRes.status} ${err.substring(0, 200)}` }) };
  }

  const nvidiaData = await nvidiaRes.json();
  const aiResponseText = nvidiaData.choices[0]?.message?.content || '{}';
  const parsed = JSON.parse(aiResponseText);
  parsed.extractedText = text;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(parsed),
  };
};
