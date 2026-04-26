import { 
  collection, 
  doc, 
  getDoc, 
  query, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  arrayUnion,
  Timestamp,
  increment
} from "firebase/firestore";
import { db } from "../firebase";
import { Tournament } from "../types";

const TOURNAMENTS_COLLECTION = "tournaments";

export const tournamentService = {
  // Récupérer tous les tournois en temps réel
  subscribeToTournaments(callback: (tournaments: Tournament[]) => void) {
    const q = query(collection(db, TOURNAMENTS_COLLECTION), orderBy("startDate", "asc"));
    return onSnapshot(q, (querySnapshot) => {
      const tournaments = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }) as Tournament)
        .filter(tournament => !tournament.isArchived);
      callback(tournaments);
    });
  },

  // Récupérer un tournoi en temps réel par son ID
  subscribeToTournament(id: string, callback: (tournament: Tournament | null) => void) {
    const docRef = doc(db, TOURNAMENTS_COLLECTION, id);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const tournament = { id: docSnap.id, ...docSnap.data() } as Tournament;
        callback(tournament.isArchived ? null : tournament);
      } else {
        callback(null);
      }
    });
  },

  // Récupérer un tournoi par son ID (Promesse)
  async getTournamentById(id: string) {
    try {
      const docRef = doc(db, TOURNAMENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const tournament = { id: docSnap.id, ...docSnap.data() } as Tournament;
        return tournament.isArchived ? null : tournament;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Créer un nouveau tournoi (pour l'admin)
  async createTournament(tournamentData: Omit<Tournament, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, TOURNAMENTS_COLLECTION), {
        ...tournamentData,
        isArchived: false,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  },

  // Inscrire une équipe à un tournoi
  async registerTeam(tournamentId: string, teamData: any) {
    try {
      const docRef = doc(db, TOURNAMENTS_COLLECTION, tournamentId);
      await updateDoc(docRef, {
        teams: arrayUnion(teamData),
        currentTeams: increment(1)
      });
    } catch (error) {
      throw error;
    }
  },

  async archiveTournament(tournamentId: string, archivedBy: string) {
    try {
      const docRef = doc(db, TOURNAMENTS_COLLECTION, tournamentId);
      await updateDoc(docRef, {
        isArchived: true,
        archivedBy,
        archivedAt: new Date().toISOString(),
      });
    } catch (error) {
      throw error;
    }
  }
};
