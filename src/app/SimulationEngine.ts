import { useState, useEffect, useCallback } from 'react';
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
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [recommendation, setRecommendation] = useState<string>("Analyzing crowd patterns...");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLive, setIsLive] = useState(true);
  
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
    // Start simulation automatically if live
    let stopSim: (() => void) | undefined;
    if (isLive) {
      startSimulation().then(stop => {
        stopSim = stop;
      });
    }

    const unsubscribeZones = onSnapshot(collection(db, 'zones'), (snapshot) => {
      if (snapshot.empty) {
        setZones([]);
        return;
      }

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
  
  return { zones, recommendation, alerts, insights, isLive, setIsLive, getZoneHistory, acknowledgeAlert };
}
