import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  arrayUnion,
  Timestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { Tournament } from "../types";

const TOURNAMENTS_COLLECTION = "tournaments";

export const tournamentService = {
  // Récupérer tous les tournois en temps réel
  subscribeToTournaments(callback: (tournaments: Tournament[]) => void) {
    const q = query(collection(db, TOURNAMENTS_COLLECTION), orderBy("startDate", "asc"));
    return onSnapshot(q, (querySnapshot) => {
      const tournaments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Tournament[];
      callback(tournaments);
    });
  },

  // Récupérer un tournoi par son ID
  async getTournamentById(id: string) {
    try {
      const docRef = doc(db, TOURNAMENTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Tournament;
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
        currentTeams: Timestamp.now() // On pourrait incrémenter un compteur ici
      });
      
      // Note: Dans une vraie app, on utiliserait increment() pour currentTeams
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        await updateDoc(docRef, {
          currentTeams: snap.data().teams.length
        });
      }
    } catch (error) {
      throw error;
    }
  }
};
