import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    const systemPrompt = `You are an expert Derma AI Copilot for Rederm Connect, Pakistan's leading professional platform for dermatologists. 
    Provide evidence-based recommendations, guidelines, research references, drug options, and follow-up advice for dermatological conditions. 
    Maintain a professional, clinical tone. Always include a disclaimer that you are an AI assistant and clinical correlation is required.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const result = await model.generateContent(systemPrompt + "\\n\\nUser Question: " + lastMessage);
    const response = await result.response;
    const replyText = response.text();

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
