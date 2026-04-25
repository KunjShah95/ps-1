import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  limit, 
  where,
  orderBy,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { startSimulation } from '@/lib/simulation-service';

const MOCK_ZONES: ZoneData[] = [
  { id: 'gate-a', name: 'Gate A (Main)', count: 1250, capacity: 5000, percentage: 25, waitTime: 3, status: 'low' },
  { id: 'gate-b', name: 'Gate B (North)', count: 2100, capacity: 3000, percentage: 70, waitTime: 8, status: 'high' },
  { id: 'food-court', name: 'Food Court Central', count: 1600, capacity: 2000, percentage: 80, waitTime: 12, status: 'critical' },
  { id: 'south-stand', name: 'South Stand', count: 4200, capacity: 15000, percentage: 28, waitTime: 2, status: 'low' },
  { id: 'north-stand', name: 'North Stand', count: 9800, capacity: 12000, percentage: 82, waitTime: 15, status: 'critical' },
];

export interface ZoneData {
  id: string;
  name: string;
  count: number;
  capacity: number;
  waitTime: number;
  status: 'low' | 'medium' | 'high' | 'critical';
  percentage: number;
}

export interface ZoneHistory {
  count: number;
  percentage: number;
  timestamp: Timestamp;
}

export interface Alert {
  id: string;
  zoneId: string;
  zoneName: string;
  type: 'critical' | 'high' | 'warning';
  message: string;
  timestamp: Timestamp | null;
  created_at?: Timestamp;
}

export interface Insights {
  totalPeople: number;
  averageWaitTime: number;
  criticalZones: number;
  throughputRate: number;
}

export function useSimulation() {
  const [zones, setZones] = useState<ZoneData[]>(MOCK_ZONES);
  const [recommendation, setRecommendation] = useState<string>("Analyzing crowd patterns...");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLive, setIsLive] = useState(true);
  const mockDataRef = useRef(MOCK_ZONES.map(z => ({ ...z })));
  const hasFirebaseData = useRef(false);
  
  const getZoneHistory = useCallback(async (zoneId: string, limitCount: number = 10) => {
    const historyQuery = query(
      collection(db, 'zones', zoneId, 'history'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(historyQuery);
    return snapshot.docs.map(doc => doc.data() as ZoneHistory).reverse();
  }, []);

  const acknowledgeAlert = useCallback(async (alertId: string) => {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'alerts', alertId), {
        acknowledged: true,
        acknowledgedAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Failed to acknowledge alert:", error);
    }
  }, []);

  useEffect(() => {
    let stopSim: (() => void) | undefined;
    if (isLive) {
      startSimulation()
        .then(stop => {
          stopSim = stop;
          console.log("Simulation started - data will update in Firebase every 1 minute");
        })
        .catch(err => console.error("Failed to start simulation:", err));
    }

    const unsubscribeZones = onSnapshot(collection(db, 'zones'), (snapshot) => {
      console.log("Firebase zones snapshot received, docs:", snapshot.size);
      
      if (snapshot.empty) {
        console.log("No zones in Firebase yet - using mock data");
        hasFirebaseData.current = false;
        return;
      }

      hasFirebaseData.current = true;

      const zonesData = snapshot.docs.map(doc => {
        const data = doc.data();
        const count = data.count || 0;
        const capacity = data.capacity || 1000;
        const percentage = Math.round((count / capacity) * 100);
        const waitTime = data.waitTime || Math.floor(count / 10);
        
        let status: ZoneData['status'] = 'low';
        if (percentage > 85) status = 'critical';
        else if (percentage > 60) status = 'high';
        else if (percentage > 30) status = 'medium';

        return {
          id: doc.id,
          name: data.name || 'Unknown Zone',
          count,
          capacity,
          percentage,
          waitTime,
          status
        } as ZoneData;
      });
      
      console.log("Updated zones from Firebase:", zonesData.map(z => `${z.id}: ${z.count}`).join(", "));
      setZones(zonesData);

      if (zonesData.length > 0) {
        const sorted = [...zonesData].sort((a, b) => a.percentage - b.percentage);
        setRecommendation(`Suggested route: Use ${sorted[0].name} for optimal flow.`);
      }

      const totalPeople = zonesData.reduce((acc, z) => acc + z.count, 0);
      const avgWait = zonesData.length ? zonesData.reduce((acc, z) => acc + z.waitTime, 0) / zonesData.length : 0;
      
      setInsights({
        totalPeople,
        averageWaitTime: Math.round(avgWait),
        criticalZones: zonesData.filter(z => z.status === 'critical').length,
        throughputRate: Math.round(totalPeople / 60)
      });
    }, (error) => {
      console.error("Firestore zones subscription error:", error);
    });

    const alertsQuery = query(
      collection(db, 'alerts'), 
      where('acknowledged', '==', false),
      orderBy('created_at', 'desc'),
      limit(5)
    );

    const unsubscribeAlerts = onSnapshot(alertsQuery, (snapshot) => {
      const fetchedAlerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Alert));
      
      const sortedAlerts = fetchedAlerts.sort((a, b) => {
        const timeA = a.created_at?.toMillis?.() || 0;
        const timeB = b.created_at?.toMillis?.() || 0;
        return timeB - timeA;
      }).slice(0, 5);

      setAlerts(sortedAlerts);
    }, (error) => {
      console.error("Firestore alerts subscription error:", error);
    });

    return () => {
      unsubscribeZones();
      unsubscribeAlerts();
      if (stopSim) stopSim();
    };
  }, [isLive]);

  useEffect(() => {
    const updateMockData = () => {
      if (hasFirebaseData.current) {
        console.log("Firebase has data - skipping mock update");
        return;
      }
      
      const updated = mockDataRef.current.map(zone => {
        const change = Math.floor((Math.random() - 0.5) * 200);
        let newCount = Math.max(0, Math.min(zone.capacity, zone.count + change));
        const newPercentage = Math.round((newCount / zone.capacity) * 100);
        let newStatus: ZoneData['status'] = 'low';
        if (newPercentage > 85) newStatus = 'critical';
        else if (newPercentage > 60) newStatus = 'high';
        else if (newPercentage > 30) newStatus = 'medium';
        
        return { ...zone, count: newCount, percentage: newPercentage, status: newStatus, waitTime: Math.floor(newCount / 10) };
      });
      
      mockDataRef.current = updated;
      setZones(updated);
      
      const sorted = [...updated].sort((a, b) => a.percentage - b.percentage);
      setRecommendation(`Suggested route: Use ${sorted[0].name} for optimal flow.`);
      
      const totalPeople = updated.reduce((acc, z) => acc + z.count, 0);
      const avgWait = updated.length ? updated.reduce((acc, z) => acc + z.waitTime, 0) / updated.length : 0;
      setInsights({
        totalPeople,
        averageWaitTime: Math.round(avgWait),
        criticalZones: updated.filter(z => z.status === 'critical').length,
        throughputRate: Math.round(totalPeople / 60)
      });
    };

    const interval = setInterval(updateMockData, 60000);
    return () => clearInterval(interval);
  }, []);
  
  return { zones, recommendation, alerts, insights, isLive, setIsLive, getZoneHistory, acknowledgeAlert };
}
