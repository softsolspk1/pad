import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({ 
        error: 'Please add your Google Gemini API key to the .env file (GEMINI_API_KEY=your_key)' 
      }, { status: 500 });
    }

    const lastMessage = messages[messages.length - 1].content;
    const systemPrompt = `You are an expert Dermatology AI Copilot for Rederm Connect, Pakistan's leading professional platform for dermatologists. 
    Provide evidence-based recommendations, guidelines, research references, drug options, and follow-up advice for dermatological conditions. 
    Maintain a professional, clinical tone. Always include a disclaimer that you are an AI assistant and clinical correlation is required.`;

    // Direct HTTP call to Gemini API for simplicity and to avoid specific SDK version issues
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt + "\n\nUser Question: " + lastMessage }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return NextResponse.json({ error: 'Error calling AI model' }, { status: 500 });
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I could not generate a response.";

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
