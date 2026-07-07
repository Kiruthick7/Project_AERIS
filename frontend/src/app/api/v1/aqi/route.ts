import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const token = process.env.WAQI_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "WAQI_TOKEN is missing in .env.local" }, { status: 500 });
    }
    
    // Using Next.js fetch with 5-minute revalidation (300 seconds)
    const res = await fetch(`https://api.waqi.info/feed/bangalore/?token=${token}`, {
      next: { revalidate: 300 }
    });
    
    const data = await res.json();
    
    if (data.status !== 'ok') {
      return NextResponse.json({ error: "WAQI API error", details: data }, { status: 500 });
    }

    return NextResponse.json(data.data);
  } catch (error) {
    console.error("AQI Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch AQI data" }, { status: 500 });
  }
}
