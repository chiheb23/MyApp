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

const MATCHES_COLLECTION = "matches";

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
      }
    } catch (error) {
      throw error;
    }
  }
};
