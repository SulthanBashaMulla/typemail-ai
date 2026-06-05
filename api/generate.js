export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipient, tone, purpose, senderName } = req.body;

  if (!purpose || !senderName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert email writer who understands relationships and communication styles deeply.

Write a professional email with these details:
- Recipient type: ${recipient}
- Tone: ${tone}
- Purpose: ${purpose}
- Sender name: ${senderName}

Respond ONLY in this exact JSON format with no extra text:
{
  "subjectLines": ["subject 1", "subject 2", "subject 3"],
  "email": "complete email body here",
  "responseLikelihood": 85,
  "followUp": "follow up message suggestion here"
}`
            }]
          }],
          generationConfig: { maxOutputTokens: 1000 }
        })
      }
    );

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const text = data.candidates[0].content.parts[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
