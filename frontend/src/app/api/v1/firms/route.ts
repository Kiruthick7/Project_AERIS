import { NextResponse } from 'next/server';
const crg = require('city-reverse-geocoder');

export async function GET() {
  try {
    const token = process.env.NASA_FIRMS_KEY;
    if (!token) {
      return NextResponse.json({ error: "NASA_FIRMS_KEY is missing in .env.local" }, { status: 500 });
    }
    
    // Global Bounding Box: West, South, East, North
    // -180,-90,180,90
    const bbox = "-180,-90,180,90";
    // We will query VIIRS SNPP NRT (Near Real-Time) for the last 1 day
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${token}/VIIRS_SNPP_NRT/${bbox}/1`;
    
    const res = await fetch(url, {
      cache: 'no-store' // The global CSV is ~6.4MB, which exceeds Next.js's 2MB fetch cache limit
    });
    
    if (!res.ok) {
       return NextResponse.json({ error: "Failed to fetch from NASA FIRMS" }, { status: 500 });
    }

    const csvText = await res.text();
    const lines = csvText.trim().split('\n');
    
    if (lines.length <= 1) {
       // Only header or empty
       return NextResponse.json([]);
    }

    const headers = lines[0].split(',');
    
    // We cap it at 500 incidents so we don't crash the browser with 10,000+ global fire markers
    const incidents = lines.slice(1, 501).map((line, index) => {
      const values = line.split(',');
      const lat = parseFloat(values[0]);
      const lng = parseFloat(values[1]);
      const bright_ti4 = parseFloat(values[2]);
      const acq_date = values[5];
      const acq_time = values[6]; // HHMM
      const confidence = values[8]; // 'l', 'n', 'h' for low, nominal, high (or sometimes a number)

      let timestamp = new Date().toISOString();
      if (acq_date && acq_time) {
         try {
           const paddedTime = String(acq_time).padStart(4, '0');
           const hours = paddedTime.substring(0, 2);
           const mins = paddedTime.substring(2, 4);
           const d = new Date(`${acq_date}T${hours}:${mins}:00Z`);
           if (!isNaN(d.getTime())) {
             timestamp = d.toISOString();
           }
         } catch(e) {}
      }
      
      let confidenceLevel = 85;
      if (confidence === 'h') confidenceLevel = 98;
      else if (confidence === 'l') confidenceLevel = 60;
      else if (!isNaN(Number(confidence))) confidenceLevel = Number(confidence);

      let locationName = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
      try {
        const geo = crg(lat, lng);
        if (geo && geo.length > 0) {
          locationName = `${geo[0].city}, ${geo[0].country}`;
        }
      } catch (e) {
        // Ignore geo failures
      }

      return {
        id: `FIRMS-${acq_date.replace(/-/g, '')}-${index}`,
        title: "Satellite Detected Fire (NASA)",
        description: `Active thermal anomaly detected by VIIRS SNPP satellite. Brightness temperature: ${bright_ti4}K.`,
        lat: lat,
        lng: lng,
        status: "Verified",
        priority: confidenceLevel > 90 ? "Critical" : (confidenceLevel > 75 ? "High" : "Medium"),
        locationName: locationName,
        aiConfidence: confidenceLevel,
        reporterTrustScore: 10000, // It's a satellite
        recommendedAction: "Dispatch drone unit to verify coordinates. Scrape local news/social media for corroborating reports.",
        expectedImpact: "Early intervention prevents fire spread and significant local air quality degradation.",
        explainabilityTrace: `AI REASONING TRACE
==================
> Sensor Source: NASA VIIRS SNPP (Near Real-Time)
> Thermal Reading: Brightness Temp ${bright_ti4}K detected
> Confidence: ${confidenceLevel}% based on orbital telemetry
> Note: Live orbital observation. Ground verification required.`,
        timestamp: timestamp
      };
    });

    return NextResponse.json(incidents);
  } catch (error: any) {
    console.error("FIRMS Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch FIRMS data", details: error.message }, { status: 500 });
  }
}
