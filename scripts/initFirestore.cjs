const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, Timestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBvpqPvSE-cSA2cGHV0mi1tc90e29iDyR8",
  authDomain: "football-1a271.firebaseapp.com",
  projectId: "football-1a271",
  storageBucket: "football-1a271.firebasestorage.app",
  messagingSenderId: "605161827570",
  appId: "1:605161827570:web:1e38823223861b86bb746b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const users = [
  { id: 'u1', name: 'Ahmed Ben Ali', avatar: '👤', phone: '+216 98 765 432', city: 'Tunis', level: 'Avancé', position: 'Milieu', rating: 4.5, matchesPlayed: 87, goals: 42, assists: 31, joined: '2024-03-15' },
  { id: 'u2', name: 'Youssef Karray', avatar: '🧑', phone: '+216 55 123 456', city: 'Sfax', level: 'Pro', position: 'Attaquant', rating: 4.8, matchesPlayed: 150, goals: 120, assists: 45, joined: '2023-01-01' }
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
    entryFee: 300, status: 'registration', type: '5v5', isLive: false,
    teams: [
      { id: 'tt1', name: 'FC Menzah', logo: '🔴', players: [], seed: 1 },
      { id: 'tt2', name: 'AS Lac', logo: '🔵', players: [], seed: 2 }
    ],
    bracket: [],
    createdAt: Timestamp.now()
  }
];

async function init() {
  console.log("Démarrage de l'initialisation Firestore...");
  
  try {
    for (const user of users) {
      await setDoc(doc(db, "users", user.id), user);
      console.log(`Utilisateur ${user.name} ajouté.`);
    }

    for (const match of matches) {
      await setDoc(doc(db, "matches", match.id), match);
      console.log(`Match ${match.title} ajouté.`);
    }

    for (const tournament of tournaments) {
      await setDoc(doc(db, "tournaments", tournament.id), tournament);
      console.log(`Tournoi ${tournament.name} ajouté.`);
    }

    console.log("Initialisation terminée avec succès !");
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors de l'initialisation :", error);
    process.exit(1);
  }
}

init();
