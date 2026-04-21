exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) return { statusCode: 500, body: JSON.stringify({ error: 'NVIDIA_API_KEY missing' }) };

  let body;
  try { body = JSON.parse(event.body); } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid body' }) };
  }

  const { text, message, history } = body;
  if (!message || !text) return { statusCode: 400, body: JSON.stringify({ error: 'Missing message or text.' }) };

  const messages = [
    { role: 'system', content: `You are answering questions about this specific legal case evidence:\n\nEVIDENCE:\n${text}\n\nAnswer clearly based ONLY on the evidence provided.` },
    ...(history || []),
    { role: 'user', content: message },
  ];

  const payload = {
    model: 'meta/llama-3.1-70b-instruct',
    messages,
    temperature: 0.3,
    max_tokens: 1000,
  };

  const nvidiaRes = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!nvidiaRes.ok) throw new Error(await nvidiaRes.text());

  const nvidiaData = await nvidiaRes.json();
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply: nvidiaData.choices[0]?.message?.content || '' }),
  };
};
