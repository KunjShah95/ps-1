import { ZoneData, Recommendation, Alert, ZONES } from './types';

export function generateAlerts(zones: ZoneData[]): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();
  
  zones.forEach((zone) => {
    if (zone.status === 'critical') {
      alerts.push({
        id: `${zone.id}-critical-${now.getTime()}`,
        zoneId: zone.id,
        zoneName: zone.name,
        type: 'critical',
        message: `${zone.name} is at critical capacity (${zone.percentage}%). Immediate attention required.`,
        timestamp: now,
      });
    } else if (zone.status === 'high') {
      alerts.push({
        id: `${zone.id}-high-${now.getTime()}`,
        zoneId: zone.id,
        zoneName: zone.name,
        type: 'high',
        message: `${zone.name} crowd level elevated (${zone.percentage}%). Consider redirecting flow.`,
        timestamp: now,
      });
    }
  });
  
  return alerts;
}

export function getZoneInsights(zones: ZoneData[]): {
  totalPeople: number;
  averageWaitTime: number;
  criticalZones: number;
  throughputRate: number;
} {
  const totalPeople = zones.reduce((sum, z) => sum + z.count, 0);
  const totalWaitTime = zones.reduce((sum, z) => sum + z.waitTime, 0);
  const criticalZones = zones.filter((z) => z.status === 'critical' || z.status === 'high').length;
  const throughputRate = zones.reduce((sum, z) => sum + (z.waitTime > 0 ? z.count / z.waitTime : 0), 0);
  
  return {
    totalPeople,
    averageWaitTime: Math.round(totalWaitTime / zones.length),
    criticalZones,
    throughputRate: Math.round(throughputRate),
  };
}

export function generateRecommendation(zones: ZoneData[]): Recommendation {
  const scoredZones = zones.map((zone) => {
    let score = 100 - zone.percentage;
    if (zone.status === 'critical') score -= 50;
    else if (zone.status === 'high') score -= 25;
    if (zone.waitTime < 5) score += 15;
    else if (zone.waitTime < 10) score += 10;
    return { ...zone, score };
  });
  
  scoredZones.sort((a, b) => b.score - a.score);
  const best = scoredZones[0];
  
  let message = '';
  let reasoning = '';
  let confidence = 0.85;
  
  if (best.percentage < 30) {
    message = `${best.name} is your best option - only ${best.percentage}% full`;
    reasoning = 'Low crowd density with minimal wait time';
  } else if (best.percentage < 60) {
    message = `Head to ${best.name} - moderate crowd level at ${best.percentage}%`;
    reasoning = 'Balanced option between crowd level and accessibility';
  } else {
    message = `${best.name} is least crowded at ${best.percentage}% - expect delays`;
    reasoning = 'All zones are busy; this is the best available option';
    confidence = 0.7;
  }
  
  return {
    zoneId: best.id,
    zoneName: best.name,
    message,
    reasoning,
    confidence,
  };
}