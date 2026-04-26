import {
  collection,
  getDoc,
  getDocs,
  doc,
  query,
  onSnapshot
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../firebase';
import { Match } from '../types';

const MATCHES_COLLECTION = 'matches';

interface CreateMatchInput {
  title: string;
  placeId: string;
  datetime: string;
  duration: number;
  maxPlayers: number;
  fee: number;
  type: Match['type'];
  description?: string;
}

const createMatchCallable = httpsCallable<CreateMatchInput, { matchId: string }>(
  functions,
  'createMatch'
);

const joinMatchCallable = httpsCallable<{ matchId: string }, { success: boolean }>(
  functions,
  'joinMatch'
);

const leaveMatchCallable = httpsCallable<{ matchId: string }, { success: boolean }>(
  functions,
  'leaveMatch'
);

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const matchService = {
  async createMatch(matchData: CreateMatchInput) {
    const result = await createMatchCallable(matchData);
    return result.data.matchId;
  },

  async getMatches() {
    const querySnapshot = await getDocs(collection(db, MATCHES_COLLECTION));
    return querySnapshot.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() } as Match));
  },

  subscribeToMatches(callback: (matches: Match[]) => void) {
    const q = query(collection(db, MATCHES_COLLECTION));
    return onSnapshot(q, (querySnapshot) => {
      const matches = querySnapshot.docs.map((snapshot) => ({ id: snapshot.id, ...snapshot.data() } as Match));
      callback(matches);
    });
  },

  subscribeToMatchesByPlaceIds(placeIds: string[], callback: (matches: Match[]) => void) {
    return this.subscribeToMatches((matches) => {
      if (placeIds.length === 0) {
        callback([]);
        return;
      }

      callback(matches.filter((match) => placeIds.includes(match.placeId)));
    });
  },

  subscribeToMatch(id: string, callback: (match: Match | null) => void) {
    const docRef = doc(db, MATCHES_COLLECTION, id);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as Match);
        return;
      }

      callback(null);
    });
  },

  async getMatchById(id: string) {
    const docRef = doc(db, MATCHES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Match;
    }

    return null;
  },

  async joinMatch(matchId: string) {
    await joinMatchCallable({ matchId });
  },

  async leaveMatch(matchId: string) {
    await leaveMatchCallable({ matchId });
  }
};
