import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  Timestamp 
} from "firebase/firestore";
import { db } from "../firebase";
import { User } from "../types";

const USERS_COLLECTION = "users";

export const userService = {
  // Récupérer le profil d'un utilisateur
  async getUserProfile(userId: string) {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  // Créer ou mettre à jour le profil d'un utilisateur
  async saveUserProfile(userId: string, userData: Partial<User>) {
    try {
      const docRef = doc(db, USERS_COLLECTION, userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        await updateDoc(docRef, {
          ...userData,
          updatedAt: Timestamp.now()
        });
      } else {
        await setDoc(docRef, {
          ...userData,
          id: userId,
          joined: new Date().toISOString().split('T')[0],
          createdAt: Timestamp.now()
        });
      }
    } catch (error) {
      throw error;
    }
  }
};
