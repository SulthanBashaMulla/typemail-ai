export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { recipient, tone, purpose, senderName } = req.body;

  if (!purpose || !senderName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: `You are an expert email writer who understands relationships and communication styles deeply.`
          },
          {
            role: 'user',
            content: `Write a professional email with these details:
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
    return res.status(500).json({ 
      error: error.message || 'Server error occurred'
    });
  }
