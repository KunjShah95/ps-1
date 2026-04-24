export interface Zone {
  id: string;
  name: string;
  capacity: number;
  serviceRate: number;
  location: {
    x: number;
    y: number;
  };
}

export interface ZoneData {
  id: string;
  name: string;
  count: number;
  capacity: number;
  percentage: number;
  waitTime: number;
  status: 'low' | 'medium' | 'high' | 'critical';
}

export interface Recommendation {
  zoneId: string;
  zoneName: string;
  message: string;
  reasoning: string;
  confidence: number;
}

export interface Alert {
  id: string;
  zoneId: string;
  zoneName: string;
  type: 'critical' | 'high' | 'warning';
  message: string;
  timestamp: Date;
}

export const ZONES: Zone[] = [
  {
    id: 'gate-a',
    name: 'Gate A (Main)',
    capacity: 5000,
    serviceRate: 150,
    location: { x: 0, y: 0 },
  },
  {
    id: 'gate-b',
    name: 'Gate B (North)',
    capacity: 3000,
    serviceRate: 100,
    location: { x: 1, y: 0 },
  },
  {
    id: 'food-court',
    name: 'Food Court Central',
    capacity: 2000,
    serviceRate: 80,
    location: { x: 0, y: 1 },
  },
  {
    id: 'south-stand',
    name: 'South Stand',
    capacity: 15000,
    serviceRate: 500,
    location: { x: 1, y: 1 },
  },
  {
    id: 'north-stand',
    name: 'North Stand',
    capacity: 12000,
    serviceRate: 400,
    location: { x: 2, y: 1 },
  },
];

export function getStatus(percentage: number): ZoneData['status'] {
  if (percentage >= 85) return 'critical';
  if (percentage >= 60) return 'high';
  if (percentage >= 30) return 'medium';
  return 'low';
}

export function calculateWaitTime(count: number, serviceRate: number): number {
  if (count === 0) return 0;
  const wait = Math.round((count / serviceRate) * 10) / 10;
  return Math.min(Math.round(wait), 30);
}