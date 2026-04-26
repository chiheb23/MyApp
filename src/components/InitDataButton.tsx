import { useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { Loader2, Database } from 'lucide-react';

export default function InitDataButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const initData = async () => {
    setLoading(true);
    try {
      // Données de test
      const users = [
        { id: 'u1', name: 'Ahmed Ben Ali', email: 'ahmed@kooratime.tn', avatar: '👤', phone: '+216 98 765 432', city: 'Tunis', level: 'Avancé', position: 'Milieu', rating: 4.5, matchesPlayed: 87, goals: 42, assists: 31, joined: '2024-03-15', role: 'admin' },
        { id: 'u2', name: 'Youssef Karray', email: 'youssef@kooratime.tn', avatar: '🧑', phone: '+216 55 123 456', city: 'Sfax', level: 'Pro', position: 'Attaquant', rating: 4.8, matchesPlayed: 150, goals: 120, assists: 45, joined: '2023-01-01', role: 'user' }
      ];

      const places = [
        {
          id: 'p1',
          adminId: 'u1',
          adminName: 'Ahmed Ben Ali',
          name: 'Stade El Menzah Mini',
          city: 'Tunis',
          address: 'Cité El Menzah VI',
          lat: 36.8355,
          lng: 10.1656,
          phone: '+216 70 000 000',
          pricePerHour: 120,
          rating: 4.6,
          image: '🏟️',
          amenities: ['Parking', 'Vestiaires', 'Eclairage'],
          isActive: true,
          createdAt: '2026-04-20T10:00:00.000Z',
        }
      ];

      const matches = [
        {
          id: 'm1', title: 'Match du Vendredi Soir', ownerId: 'u1', ownerName: 'Ahmed Ben Ali', ownerAvatar: '👤',
          placeId: 'p1', placeName: 'Stade El Menzah Mini', placeCity: 'Tunis', placeAddress: 'Cité El Menzah VI',
          lat: 36.8355, lng: 10.1656, datetime: '2026-05-14T20:00:00', duration: 90, maxPlayers: 10,
          currentPlayers: 2, fee: 15, status: 'open', type: '5v5', description: 'Match hebdomadaire entre amis.',
          players: [
            { userId: 'u1', name: 'Ahmed Ben Ali', avatar: '👤', position: 'Milieu', rating: 4.5, paid: true },
            { userId: 'u2', name: 'Youssef Karray', avatar: '🧑', position: 'Attaquant', rating: 4.8, paid: true }
          ],
          createdAt: Timestamp.now()
        }
      ];

      const tournaments = [
        {
          id: 't1', name: 'Coupe Ramadan 2026', organizerId: 'u1', organizerName: 'Ahmed Ben Ali', city: 'Tunis',
          startDate: '2026-03-01', endDate: '2026-03-15', maxTeams: 8, currentTeams: 2, prizePool: 2000,
          entryFee: 300, status: 'registration', type: '5v5', isLive: false, isArchived: false,
          teams: [
            { id: 'tt1', name: 'FC Menzah', logo: '🔴', players: [], seed: 1 },
            { id: 'tt2', name: 'AS Lac', logo: '🔵', players: [], seed: 2 }
          ],
          bracket: [],
          createdAt: Timestamp.now()
        }
      ];

      // Injection dans Firestore
      for (const user of users) {
        await setDoc(doc(db, "users", user.id), user);
      }
      for (const place of places) {
        await setDoc(doc(db, "places", place.id), place);
      }
      for (const match of matches) {
        await setDoc(doc(db, "matches", match.id), match);
      }
      for (const tournament of tournaments) {
        await setDoc(doc(db, "tournaments", tournament.id), tournament);
      }

      setStatus('success');
    } catch (error) {
      console.error("Erreur d'initialisation:", error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 glass rounded-2xl border border-emerald-500/30 bg-emerald-500/5 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-emerald-400 flex items-center gap-2">
            <Database size={18} /> Configuration Initiale
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Cliquez pour injecter les données de test dans votre Firestore.
          </p>
        </div>
        <button 
          onClick={initData}
          disabled={loading || status === 'success'}
          className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
            status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
            status === 'error' ? 'bg-red-500/20 text-red-400' :
            'bg-emerald-500 text-white hover:bg-emerald-600'
          }`}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : null}
          {status === 'success' ? 'Données Injectées !' : status === 'error' ? 'Erreur (voir console)' : 'Initialiser Firestore'}
        </button>
      </div>
    </div>
  );
}
