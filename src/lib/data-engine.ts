import { ZONES, ZoneData, getStatus, calculateWaitTime } from './types';

export interface SimulationConfig {
  enableRealisticPatterns: boolean;
  crowdSpikeProbability: number;
  baseVariance: number;
}

const DEFAULT_CONFIG: SimulationConfig = {
  enableRealisticPatterns: true,
  crowdSpikeProbability: 0.15,
  baseVariance: 0.3,
};

let cachedData: ZoneData[] | null = null;

export function generateZoneData(config: SimulationConfig = DEFAULT_CONFIG): ZoneData[] {
  const hour = new Date().getHours();
  
  let baseLoad = 0.5;
  if (hour >= 17 && hour <= 20) baseLoad = 0.7;
  else if (hour >= 14 && hour <= 16) baseLoad = 0.4;
  else if (hour >= 9 && hour <= 12) baseLoad = 0.3;
  
  const data: ZoneData[] = ZONES.map((zone) => {
    let variance = (Math.random() - 0.5) * config.baseVariance;
    
    if (zone.id.includes('gate') && hour >= 17 && hour <= 19) {
      variance += config.crowdSpikeProbability;
    }
    if (zone.id === 'food-court' && hour >= 12 && hour <= 13) {
      variance += config.crowdSpikeProbability;
    }
    
    let count = Math.floor(zone.capacity * (baseLoad + variance));
    count = Math.max(0, Math.min(count, Math.floor(zone.capacity * 0.95)));
    
    const percentage = Math.round((count / zone.capacity) * 100);
    const waitTime = calculateWaitTime(count, zone.serviceRate);
    
    return {
      id: zone.id,
      name: zone.name,
      count,
      capacity: zone.capacity,
      percentage,
      waitTime,
      status: getStatus(percentage),
    };
  });
  
  return data;
}

export function getZoneData(): ZoneData[] {
  if (!cachedData) {
    cachedData = generateZoneData();
  }
  return cachedData;
}

export function refreshZoneData(): ZoneData[] {
  cachedData = generateZoneData();
  return cachedData;
}

export function getZoneById(id: string): ZoneData | undefined {
  return getZoneData().find((z) => z.id === id);
}