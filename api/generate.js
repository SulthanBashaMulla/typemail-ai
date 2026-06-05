export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipient, tone, purpose, senderName, paragraphs } = req.body;

  if (!purpose || !senderName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: 'You are an expert email writer. Always respond with valid JSON only, no extra text.'
          },
          {
            role: 'user',
            content: `You are an expert email writer. Always respond with valid JSON only, no extra text.

Write a professional email with these details:
- Recipient type: ${recipient}
- Tone: ${tone}
- Purpose: ${purpose}
- Sender name: ${senderName}
- Email length: exactly ${paragraphs} paragraph(s) in the body

IMPORTANT FORMATTING RULES:
1. Each paragraph must be separated by a blank line (\\n\\n)
2. Start with greeting on its own line: "Dear [Recipient],"
3. Then a blank line before the first paragraph
4. Each body paragraph separated by blank line
5. Then closing line on its own: "Warm regards," or "Sincerely," based on tone
6. Then sender name on next line: "${senderName}"

Respond ONLY in this exact JSON format with no markdown:
{
  "subjectLines": ["subject 1", "subject 2", "subject 3"],
  "email": "Dear [Recipient],\\n\\n[paragraph 1]\\n\\n[paragraph 2]\\n\\nWarm regards,\\n${senderName}",
  "responseLikelihood": 85,
  "followUp": "follow up suggestion here"
}`
          }
        ]
      })
    });

    const data = await response.json();

    if (data.error) throw new Error(data.error.message);

    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
