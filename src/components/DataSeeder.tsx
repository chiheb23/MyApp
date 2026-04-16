import { useState } from 'react';
import { db } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { 
  users, 
  places, 
  matches, 
  tournaments, 
  chatRooms, 
  chatMessages, 
  notifications 
} from '../data';

export default function DataSeeder() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const seedData = async () => {
    setLoading(true);
    setMessage('Migration en cours... Ne quittez pas la page.');

    try {
      // 1. Users
      const usersPromises = users.map(user => setDoc(doc(db, 'users', user.id), user));
      await Promise.all(usersPromises);

      // 2. Places
      const placesPromises = places.map(place => setDoc(doc(db, 'places', place.id), place));
      await Promise.all(placesPromises);

      // 3. Matches
      const matchesPromises = matches.map(match => setDoc(doc(db, 'matches', match.id), match));
      await Promise.all(matchesPromises);

      // 4. Tournaments
      const tournamentsPromises = tournaments.map(t => setDoc(doc(db, 'tournaments', t.id), t));
      await Promise.all(tournamentsPromises);

      // 5. Chat Rooms
      const chatRoomsPromises = chatRooms.map(cr => setDoc(doc(db, 'chatRooms', cr.id), cr));
      await Promise.all(chatRoomsPromises);

      // 6. Chat Messages
      const chatMessagesPromises = chatMessages.map(msg => setDoc(doc(db, 'chatMessages', msg.id), msg));
      await Promise.all(chatMessagesPromises);

      // 7. Notifications
      const notificationsPromises = notifications.map(notif => setDoc(doc(db, 'notifications', notif.id), notif));
      await Promise.all(notificationsPromises);

      setMessage(' Migration terminée avec succès ! Vos données sont dans Firebase.');
    } catch (error: any) {
      console.error(error);
      setMessage(' Erreur lors de la migration: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <div className="glass p-8 rounded-2xl max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold text-white">Migration Firebase</h1>
        <p className="text-slate-400">
          Ce bouton va envoyer toutes les données fictives de <code>data.ts</code> vers votre base de données Cloud Firestore.
        </p>

        <button
          onClick={seedData}
          disabled={loading}
          className="btn-primary w-full py-4 rounded-xl text-white font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Migration en cours...' : 'Lancer la Migration'}
        </button>

        {message && (
          <div className={`p-4 rounded-xl text-sm font-medium ${message.includes('Erreur') ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {message}
          </div>
        )}

        {message.includes('succès') && (
          <a href="/" className="inline-block mt-4 text-emerald-400 hover:text-emerald-300 underline">
            Retour à l'accueil
          </a>
        )}
      </div>
    </div>
  );
}
