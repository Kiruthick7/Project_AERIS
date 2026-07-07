import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'healthy', 
    service: 'AERIS-Intelligence-Engine',
    timestamp: new Date().toISOString() 
  });
}
