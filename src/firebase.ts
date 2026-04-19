import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

// Configuration Firebase récupérée depuis la capture d'écran de l'utilisateur
const firebaseConfig = {
  apiKey: "AIzaSyBvpqPvSE-cSA2cGHV0mi1tc90e29iDyR8",
  authDomain: "football-1a271.firebaseapp.com",
  projectId: "football-1a271",
  storageBucket: "football-1a271.firebasestorage.app",
  messagingSenderId: "605161827570",
  appId: "1:605161827570:web:1e38823223861b86bb746b",
  measurementId: "G-JN7FL4FGV7"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Exportation des services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);

export default app;
