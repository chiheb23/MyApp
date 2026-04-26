import { useEffect, useState } from 'react';
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

      if (!fUser) {
        setUserProfile(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await userService.getUserProfile(fUser.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error('Erreur lors de la recuperation du profil:', error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    firebaseUser,
    userProfile,
    loading,
    profileMissing: Boolean(firebaseUser && !userProfile)
  };
}
