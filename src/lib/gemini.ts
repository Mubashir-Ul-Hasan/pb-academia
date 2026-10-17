export async function generateContent(options: { model?: string, contents: any, config?: { responseMimeType?: string, responseSchema?: any } }) {
  try {
    // Keep GEMINI_API_KEY on the server; the browser only calls our API endpoint.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: options.model || 'gemini-2.5-flash',
          contents: options.contents,
          responseMimeType: options.config?.responseMimeType,
          responseSchema: options.config?.responseSchema,
        }),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw Object.assign(new Error(data?.error || `AI request failed (${response.status})`), { status: response.status });
      }
      return { text: data.text };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    if (error?.name === 'AbortError') {
      throw new Error('Request timed out. The AI is taking too long to respond. Please try again.');
    }
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      throw new Error('Gemini API quota exceeded. Please wait a minute and try again, or check your API key billing details.');
    }
    throw new Error(error?.message || 'Failed to communicate with AI service.');
  }
}
