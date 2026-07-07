import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 30; // Maximum timeout for Vercel/Next.js edge if deployed

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is missing in .env.local" }, { status: 500 });
    }

    const groq = new OpenAI({
      apiKey: apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const { image, lat, lng, locationName } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    const prompt = `You are the AERIS Urban Intelligence Engine.
Analyze the provided image of a civic/environmental issue.
Output ONLY a strictly valid JSON object. Do NOT wrap it in markdown block quotes. Do NOT include \`\`\`json.
Structure:
{
  "title": "Short title of the incident",
  "description": "Detailed description of what is visible",
  "priority": "Low", "Medium", "High", or "Critical",
  "aiConfidence": <integer between 0 and 100>,
  "recommendedAction": "Actionable recommendation for the municipality",
  "expectedImpact": "What this action prevents or achieves",
  "explainabilityTrace": "A markdown string explaining your reasoning based on Vision Analysis and Risk Factor."
}`;

    const completion = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: image } }
          ]
        }
      ],
      temperature: 0.1,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) throw new Error("No response from Groq AI");

    // Clean up potential markdown formatting just in case
    const cleanResult = result.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanResult);

    return NextResponse.json({
      id: "INC-LIVE-" + Math.floor(Math.random() * 90000 + 10000),
      ...parsed,
      lat: lat || 12.9716,
      lng: lng || 77.5946,
      locationName: locationName || "Citizen Reported Location",
      status: "Verified",
      timestamp: new Date().toISOString(),
      reporterTrustScore: 1250, // Hardcoded for MVP citizen
    });

  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze image" }, { status: 500 });
  }
}
