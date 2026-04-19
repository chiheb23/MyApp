import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { Match } from "../types";
import { notificationService } from "./notificationService";

const MATCHES_COLLECTION = "matches";

// Fonction utilitaire pour calculer la distance entre deux points (Haversine)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const matchService = {
  // Créer un match
  async createMatch(matchData: Omit<Match, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, MATCHES_COLLECTION), {
        ...matchData,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Récupérer tous les matchs
  async getMatches() {
    try {
      const querySnapshot = await getDocs(collection(db, MATCHES_COLLECTION));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
    } catch (error) {
      throw error;
    }
  },

  // Écouter les matchs en temps réel
  subscribeToMatches(callback: (matches: Match[]) => void) {
    const q = query(collection(db, MATCHES_COLLECTION));
    return onSnapshot(q, (querySnapshot) => {
      const matches = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Match));
      callback(matches);
    });
  },

  // Récupérer un match par ID
  async getMatchById(id: string) {
    try {
      const docRef = doc(db, MATCHES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Match;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Rejoindre un match
  async joinMatch(matchId: string, player: any) {
    try {
      const matchRef = doc(db, MATCHES_COLLECTION, matchId);
      const matchSnap = await getDoc(matchRef);
      if (matchSnap.exists()) {
        const matchData = matchSnap.data() as Match;
        const updatedPlayers = [...matchData.players, player];
        await updateDoc(matchRef, {
          players: updatedPlayers,
          currentPlayers: updatedPlayers.length,
          status: updatedPlayers.length >= matchData.maxPlayers ? 'full' : 'open'
        });

        // Notifier le créateur du match
        if (matchData.ownerId !== player.userId) {
          await notificationService.notifyMatchJoined(matchData.ownerId, player.name, matchData.title);
        }
      }
    } catch (error) {
      throw error;
    }
  }
};
