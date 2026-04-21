import { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { User } from '../types';

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (fUser) => {
      setFirebaseUser(fUser);
      
      if (fUser) {
        try {
          // Récupérer ou créer le profil utilisateur réel
          let profile = await userService.getUserProfile(fUser.uid);
          if (!profile) {
            // Création d'un profil par défaut si inexistant
            const newProfile: Omit<User, 'id'> = {
              name: fUser.displayName || 'Joueur Anonyme',
              email: fUser.email || '',
              avatar: '⚽',
              city: 'Tunis',
              level: 'Intermédiaire',
              position: 'Milieu',
              matchesPlayed: 0,
              goals: 0,
              assists: 0,
              rating: 5.0,
              role: 'user',
              phone: '',
              joined: new Date().toISOString()
            };
            await userService.updateUserProfile(fUser.uid, newProfile);
            profile = { id: fUser.uid, ...newProfile } as User;
          }
          setUserProfile(profile);
        } catch (error) {
          console.error("Erreur lors de la récupération du profil:", error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { firebaseUser, userProfile, loading };
}
