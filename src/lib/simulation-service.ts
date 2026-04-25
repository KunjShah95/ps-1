import { 
  db 
} from "./firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  limit as fsLimit,
  deleteDoc
} from "firebase/firestore";
import { generateZoneData } from "./data-engine";
import { generateAlerts } from "./ai-engine";

const HISTORY_KEEP_COUNT = 30;
const HISTORY_FETCH_COUNT = 80;

export async function startSimulation() {
  console.log("Starting simulation data flow...");
  
  // 1. Ensure zones exist in DB
  const zonesSnap = await getDocs(collection(db, 'zones'));
  if (zonesSnap.empty) {
    console.log("Initializing zones in Firestore...");
    const initialData = generateZoneData();
    for (const zone of initialData) {
      await setDoc(doc(db, 'zones', zone.id), {
        ...zone,
        updatedAt: serverTimestamp()
      });
    }
  }

  // 2. Continuous update loop
  const interval = setInterval(async () => {
    try {
      const newData = generateZoneData();
      const now = new Date();
      
      // Update each zone and store history
      for (const zone of newData) {
        // Current state
        await setDoc(doc(db, 'zones', zone.id), {
          ...zone,
          updatedAt: serverTimestamp()
        }, { merge: true });

        // History (keep last 20 for charts)
        await addDoc(collection(db, 'zones', zone.id, 'history'), {
          count: zone.count,
          percentage: zone.percentage,
          timestamp: serverTimestamp()
        });

        // Prune old history to prevent unbounded growth
        try {
          const historyRef = collection(db, 'zones', zone.id, 'history');
          const histSnap = await getDocs(
            query(historyRef, orderBy('timestamp', 'desc'), fsLimit(HISTORY_FETCH_COUNT)),
          );
          if (histSnap.size > HISTORY_KEEP_COUNT) {
            const toDelete = histSnap.docs.slice(HISTORY_KEEP_COUNT);
            await Promise.all(toDelete.map((d) => deleteDoc(d.ref)));
          }
        } catch {
          // If pruning fails (permissions/indexing), ignore for MVP runtime continuity
        }
      }

      // Generate alerts
      const alerts = generateAlerts(newData);
      for (const alert of alerts) {
        await addDoc(collection(db, 'alerts'), {
          ...alert,
          acknowledged: false,
          created_at: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Simulation update failed:", error);
    }
  }, 10000); // Every 10 seconds

  return () => clearInterval(interval);
}
