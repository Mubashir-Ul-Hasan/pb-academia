import { GoogleGenAI } from '@google/genai';

// Vercel serverless equivalent of the existing Express /api/generate endpoint.
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.includes('YOUR_')) {
      return res.status(500).json({ error: 'Missing or invalid Gemini API Key. Configure GEMINI_API_KEY in Vercel Environment Variables.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { prompt, contents, model, responseMimeType, responseSchema } = req.body || {};
    if (!contents && !prompt) {
      return res.status(400).json({ error: 'Prompt or contents is required' });
    }

    const response = await ai.models.generateContent({
      model: model || 'gemini-2.5-flash',
      contents: contents || prompt,
      config: { responseMimeType, responseSchema },
    });
    return res.status(200).json({ text: response.text || '' });
  } catch (e: any) {
    console.error('Generate API Error:', e);
    const status = e?.status === 429 ? 429 : 500;
    return res.status(status).json({ error: e?.message || 'Internal server error' });
  }
}
