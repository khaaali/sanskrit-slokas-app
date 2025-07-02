import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { sanskritText } = await req.json();
    if (!sanskritText) {
      return NextResponse.json({ error: 'Sanskrit text is required.' }, { status: 400 });
    }

    const instructionsAndExampleInput = `
You are an API that returns ONLY a JSON object, with no markdown, no explanation, and no extra text.

For each Sanskrit input, provide:
1. Transliteration in English and Telugu.
2. Meaning in English, Hindi, and Telugu.

Format:
{
  "transliteration": { "english": "...", "telugu": "..." },
  "meaning": { "english": "...", "hindi": "...", "telugu": "..." }
}

Example:
Sanskrit: त्वमेव माता च पिता त्वमेव

Output:`;

    const exampleOutput = `{
  "transliteration": {
    "english": "tvameva mātā ca pitā tvameva",
    "telugu": "త్వమేవ మాతా చ పితా త్వమేవ"
  },
  "meaning": {
    "english": "You alone are my mother and father.",
    "hindi": "आप ही मेरी माता और पिता हैं।",
    "telugu": "మీరు మాత్రమే నా తల్లి మరియు తండ్రి."
  }
}`;

    const userPrompt = `Sanskrit: ${sanskritText}`;

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Google Gemini API key not configured.' }, { status: 500 });
    }

    // Simulate a conversation: user (instructions+example input), model (example output), user (actual input)
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: instructionsAndExampleInput }] },
          { role: "model", parts: [{ text: exampleOutput }] },
          { role: "user", parts: [{ text: userPrompt }] }
        ]
      })
    });

    if (!geminiRes.ok) {
      const err = await geminiRes.json();
      console.error('Gemini API error:', err);
      return NextResponse.json({ error: err.error?.message || 'Gemini API error' }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Parsed AI response:', aiResponse);

    return NextResponse.json({ result: aiResponse });
  } catch (error: unknown) {
    console.error('Server error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 