import { NextResponse } from 'next/server';
import { getZoneData, refreshZoneData } from '@/lib/data-engine';
import { generateAlerts, getZoneInsights } from '@/lib/ai-engine';

export async function GET() {
  try {
    const zones = getZoneData();
    const alerts = generateAlerts(zones);
    const insights = getZoneInsights(zones);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: zones,
      alerts,
      insights,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch zone data' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const zones = refreshZoneData();
    const alerts = generateAlerts(zones);
    const insights = getZoneInsights(zones);
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: zones,
      alerts,
      insights,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to refresh zone data' },
      { status: 500 }
    );
  }
}