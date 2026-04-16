import { User, Match, Place, Tournament, ChatRoom, Message, Notification } from './types';

export const currentUser: User = {
  id: 'u1',
  name: 'Ahmed Ben Ali',
  avatar: '👤',
  phone: '+216 98 765 432',
  city: 'Tunis',
  level: 'Avancé',
  position: 'Milieu',
  rating: 4.5,
  matchesPlayed: 87,
  goals: 42,
  assists: 31,
  joined: '2024-03-15',
};

export const users: User[] = [
  currentUser,
  { id: 'u2', name: 'Youssef Karray', avatar: '🧑', phone: '+216 55 123 456', city: 'Sfax', level: 'Pro', position: 'Attaquant', rating: 4.8, matchesPlayed: 150, goals: 120, assists: 45, joined: '2023-01-01' },
  { id: 'u3', name: 'Mehdi Trabelsi', avatar: '👨', phone: '+216 22 333 444', city: 'Tunis', level: 'Intermédiaire', position: 'Défenseur', rating: 4.2, matchesPlayed: 60, goals: 8, assists: 15, joined: '2024-06-01' },
  { id: 'u4', name: 'Karim Gharbi', avatar: '🧔', phone: '+216 99 876 543', city: 'Sousse', level: 'Avancé', position: 'Gardien', rating: 4.6, matchesPlayed: 95, goals: 0, assists: 3, joined: '2023-09-01' },
  { id: 'u5', name: 'Amine Riahi', avatar: '👱', phone: '+216 50 111 222', city: 'Tunis', level: 'Débutant', position: 'Attaquant', rating: 3.5, matchesPlayed: 15, goals: 6, assists: 2, joined: '2025-01-01' },
  { id: 'u6', name: 'Sami Jebali', avatar: '🧑', phone: '+216 23 456 789', city: 'Bizerte', level: 'Intermédiaire', position: 'Milieu', rating: 4.0, matchesPlayed: 45, goals: 18, assists: 22, joined: '2024-02-15' },
];

export const places: Place[] = [
  { id: 'p1', name: 'Stade El Menzah Mini', city: 'Tunis', address: 'Cité El Menzah VI', lat: 36.8355, lng: 10.1656, phone: '+216 71 234 567', pricePerHour: 80, rating: 4.5, image: '🏟️', amenities: ['Vestiaires', 'Éclairage', 'Parking', 'Gazon synthétique'] },
  { id: 'p2', name: 'Arena Foot Lac', city: 'Tunis', address: 'Les Berges du Lac 2', lat: 36.8412, lng: 10.2350, phone: '+216 71 345 678', pricePerHour: 120, rating: 4.8, image: '⚽', amenities: ['Vestiaires', 'Éclairage', 'Parking', 'Gazon naturel', 'Café', 'WiFi'] },
  { id: 'p3', name: 'City Foot Sfax', city: 'Sfax', address: 'Route de Tunis km 4', lat: 34.7398, lng: 10.7600, phone: '+216 74 234 567', pricePerHour: 60, rating: 4.2, image: '🥅', amenities: ['Vestiaires', 'Éclairage', 'Gazon synthétique'] },
  { id: 'p4', name: 'Green Pitch Sousse', city: 'Sousse', address: 'Sahloul 4', lat: 35.8250, lng: 10.6370, phone: '+216 73 456 789', pricePerHour: 70, rating: 4.4, image: '🏟️', amenities: ['Vestiaires', 'Éclairage', 'Parking', 'Gazon synthétique', 'Café'] },
  { id: 'p5', name: 'El Yasmine Sports', city: 'Tunis', address: 'Ariana - Cité Ennasr', lat: 36.8600, lng: 10.1900, phone: '+216 71 567 890', pricePerHour: 90, rating: 4.3, image: '⚽', amenities: ['Vestiaires', 'Éclairage', 'Parking', 'Gazon synthétique', 'Douches'] },
];

export const matches: Match[] = [
  {
    id: 'm1', title: 'Match du Vendredi Soir', ownerId: 'u1', ownerName: 'Ahmed Ben Ali', ownerAvatar: '👤',
    placeId: 'p1', placeName: 'Stade El Menzah Mini', placeCity: 'Tunis', placeAddress: 'Cité El Menzah VI',
    lat: 36.8355, lng: 10.1656, datetime: '2026-02-14T20:00:00', duration: 90, maxPlayers: 10,
    currentPlayers: 8, fee: 15, status: 'open', type: '5v5', description: 'Match hebdomadaire entre amis. Tous les niveaux bienvenus !',
    players: [
      { userId: 'u1', name: 'Ahmed Ben Ali', avatar: '👤', position: 'Milieu', rating: 4.5, paid: true },
      { userId: 'u2', name: 'Youssef Karray', avatar: '🧑', position: 'Attaquant', rating: 4.8, paid: true },
      { userId: 'u3', name: 'Mehdi Trabelsi', avatar: '👨', position: 'Défenseur', rating: 4.2, paid: true },
      { userId: 'u4', name: 'Karim Gharbi', avatar: '🧔', position: 'Gardien', rating: 4.6, paid: false },
      { userId: 'u5', name: 'Amine Riahi', avatar: '👱', position: 'Attaquant', rating: 3.5, paid: true },
      { userId: 'u6', name: 'Sami Jebali', avatar: '🧑', position: 'Milieu', rating: 4.0, paid: true },
      { userId: 'u7', name: 'Omar Mansour', avatar: '🧑', position: 'Défenseur', rating: 4.1, paid: false },
      { userId: 'u8', name: 'Nizar Chahed', avatar: '👨', position: 'Milieu', rating: 3.9, paid: true },
    ],
  },
  {
    id: 'm2', title: 'Foot du Dimanche 🏆', ownerId: 'u2', ownerName: 'Youssef Karray', ownerAvatar: '🧑',
    placeId: 'p2', placeName: 'Arena Foot Lac', placeCity: 'Tunis', placeAddress: 'Les Berges du Lac 2',
    lat: 36.8412, lng: 10.2350, datetime: '2026-02-16T10:00:00', duration: 120, maxPlayers: 14,
    currentPlayers: 14, fee: 20, status: 'full', type: '7v7',
    players: Array.from({ length: 14 }, (_, i) => ({
      userId: `up${i}`, name: `Joueur ${i + 1}`, avatar: '🧑', position: 'Milieu', rating: 3.5 + Math.random(), paid: Math.random() > 0.3,
    })),
  },
  {
    id: 'm3', title: 'Match Sfax — Soirée', ownerId: 'u2', ownerName: 'Youssef Karray', ownerAvatar: '🧑',
    placeId: 'p3', placeName: 'City Foot Sfax', placeCity: 'Sfax', placeAddress: 'Route de Tunis km 4',
    lat: 34.7398, lng: 10.7600, datetime: '2026-02-15T21:00:00', duration: 90, maxPlayers: 10,
    currentPlayers: 6, fee: 12, status: 'open', type: '5v5',
    players: Array.from({ length: 6 }, (_, i) => ({
      userId: `ups${i}`, name: `Joueur ${i + 1}`, avatar: '🧑', position: 'Attaquant', rating: 3.8 + Math.random() * 0.5, paid: true,
    })),
  },
  {
    id: 'm4', title: 'Sousse Weekend Game', ownerId: 'u4', ownerName: 'Karim Gharbi', ownerAvatar: '🧔',
    placeId: 'p4', placeName: 'Green Pitch Sousse', placeCity: 'Sousse', placeAddress: 'Sahloul 4',
    lat: 35.8250, lng: 10.6370, datetime: '2026-02-17T16:00:00', duration: 90, maxPlayers: 14,
    currentPlayers: 10, fee: 14, status: 'open', type: '7v7',
    players: Array.from({ length: 10 }, (_, i) => ({
      userId: `upo${i}`, name: `Joueur ${i + 1}`, avatar: '🧑', position: 'Défenseur', rating: 3.5 + Math.random() * 1, paid: Math.random() > 0.5,
    })),
  },
  {
    id: 'm5', title: 'Ennasr — Match Rapide', ownerId: 'u3', ownerName: 'Mehdi Trabelsi', ownerAvatar: '👨',
    placeId: 'p5', placeName: 'El Yasmine Sports', placeCity: 'Tunis', placeAddress: 'Ariana - Cité Ennasr',
    lat: 36.8600, lng: 10.1900, datetime: '2026-02-14T18:00:00', duration: 60, maxPlayers: 10,
    currentPlayers: 4, fee: 10, status: 'open', type: '5v5',
    players: Array.from({ length: 4 }, (_, i) => ({
      userId: `upe${i}`, name: `Joueur ${i + 1}`, avatar: '🧑', position: 'Milieu', rating: 3.2 + Math.random() * 1.5, paid: true,
    })),
  },
];

export const tournaments: Tournament[] = [
  {
    id: 't1',
    name: 'Coupe Ramadan 2026',
    organizerId: 'u1',
    organizerName: 'Ahmed Ben Ali',
    city: 'Tunis',
    startDate: '2026-03-01',
    endDate: '2026-03-15',
    maxTeams: 8,
    currentTeams: 8,
    prizePool: 2000,
    entryFee: 300,
    status: 'in_progress',
    type: '5v5',
    isLive: true,
    teams: [
      { id: 'tt1', name: 'FC Menzah', logo: '🔴', players: [], seed: 1 },
      { id: 'tt2', name: 'AS Lac', logo: '🔵', players: [], seed: 2 },
      { id: 'tt3', name: 'Étoile Ariana', logo: '⭐', players: [], seed: 3 },
      { id: 'tt4', name: 'JS Bardo', logo: '🟢', players: [], seed: 4 },
      { id: 'tt5', name: 'CO Manar', logo: '🟡', players: [], seed: 5 },
      { id: 'tt6', name: 'US Soukra', logo: '🟣', players: [], seed: 6 },
      { id: 'tt7', name: 'SC Marsa', logo: '🟠', players: [], seed: 7 },
      { id: 'tt8', name: 'RS Carthage', logo: '⚪', players: [], seed: 8 },
    ],
    bracket: [
      { id: 'b1', round: 1, position: 1, team1: { name: 'FC Menzah', score: 3, logo: '🔴' }, team2: { name: 'RS Carthage', score: 1, logo: '⚪' }, winner: 'FC Menzah' },
      { id: 'b2', round: 1, position: 2, team1: { name: 'AS Lac', score: 2, logo: '🔵' }, team2: { name: 'SC Marsa', score: 2, logo: '🟠' }, winner: 'AS Lac' },
      { id: 'b3', round: 1, position: 3, team1: { name: 'Étoile Ariana', score: 4, logo: '⭐' }, team2: { name: 'US Soukra', score: 0, logo: '🟣' }, winner: 'Étoile Ariana' },
      { id: 'b4', round: 1, position: 4, team1: { name: 'JS Bardo', score: 1, logo: '🟢' }, team2: { name: 'CO Manar', score: 3, logo: '🟡' }, winner: 'CO Manar' },
      { id: 'b5', round: 2, position: 1, team1: { name: 'FC Menzah', score: 2, logo: '🔴' }, team2: { name: 'AS Lac', score: 1, logo: '🔵' }, winner: 'FC Menzah' },
      { id: 'b6', round: 2, position: 2, team1: { name: 'Étoile Ariana', score: 1, logo: '⭐' }, team2: { name: 'CO Manar', score: 2, logo: '🟡' }, winner: 'CO Manar' },
      { id: 'b7', round: 3, position: 1, team1: { name: 'FC Menzah', score: undefined, logo: '🔴' }, team2: { name: 'CO Manar', score: undefined, logo: '🟡' }, isLive: true },
    ],
  },
  {
    id: 't2',
    name: 'Tournoi Sousse Beach Cup',
    organizerId: 'u4',
    organizerName: 'Karim Gharbi',
    city: 'Sousse',
    startDate: '2026-04-10',
    endDate: '2026-04-20',
    maxTeams: 16,
    currentTeams: 12,
    prizePool: 5000,
    entryFee: 400,
    status: 'registration',
    type: '7v7',
    teams: Array.from({ length: 12 }, (_, i) => ({
      id: `st${i}`, name: `Équipe ${i + 1}`, logo: ['🔴','🔵','⭐','🟢','🟡','🟣','🟠','⚪','🔶','🔷','💜','💚'][i], players: [], seed: i + 1,
    })),
    bracket: [],
  },
];

export const chatRooms: ChatRoom[] = [
  { id: 'cr1', name: 'Match du Vendredi Soir', type: 'match', lastMessage: 'Ahmed: On commence à 20h pile !', lastMessageTime: '14:30', unreadCount: 3, avatar: '⚽', members: 8 },
  { id: 'cr2', name: 'Coupe Ramadan 2026', type: 'tournament', lastMessage: 'Finale demain 🔥', lastMessageTime: '12:15', unreadCount: 12, avatar: '🏆', members: 40 },
  { id: 'cr3', name: 'Les gars du Lac', type: 'group', lastMessage: 'Sami: Qui est dispo samedi ?', lastMessageTime: 'Hier', unreadCount: 0, avatar: '👥', members: 15 },
  { id: 'cr4', name: 'Foot du Dimanche 🏆', type: 'match', lastMessage: 'Youssef: C\'est complet !', lastMessageTime: 'Hier', unreadCount: 0, avatar: '⚽', members: 14 },
  { id: 'cr5', name: 'Sousse Weekend Game', type: 'match', lastMessage: 'Karim: 4 places restantes', lastMessageTime: 'Lun', unreadCount: 1, avatar: '⚽', members: 10 },
];

export const chatMessages: Message[] = [
  { id: 'msg1', roomId: 'cr1', authorId: 'u1', authorName: 'Ahmed', authorAvatar: '👤', text: 'Salut les gars ! Le match de vendredi est confirmé 🎉', timestamp: '14:00', },
  { id: 'msg2', roomId: 'cr1', authorId: 'u2', authorName: 'Youssef', authorAvatar: '🧑', text: 'Top ! Je serai là. Qui d\'autre vient ?', timestamp: '14:05', },
  { id: 'msg3', roomId: 'cr1', authorId: 'u3', authorName: 'Mehdi', authorAvatar: '👨', text: 'Moi aussi ✅ J\'amène des cônes pour l\'échauffement', timestamp: '14:08', },
  { id: 'msg4', roomId: 'cr1', authorId: 'u4', authorName: 'Karim', authorAvatar: '🧔', text: 'Présent 🧤 Je prends les gants de gardien', timestamp: '14:12', },
  { id: 'msg5', roomId: 'cr1', authorId: 'system', authorName: 'Système', authorAvatar: '🤖', text: 'Amine Riahi a rejoint le match', timestamp: '14:15', isSystem: true },
  { id: 'msg6', roomId: 'cr1', authorId: 'u5', authorName: 'Amine', authorAvatar: '👱', text: 'Salam ! Content d\'être dans le groupe 💪', timestamp: '14:18', },
  { id: 'msg7', roomId: 'cr1', authorId: 'u6', authorName: 'Sami', authorAvatar: '🧑', text: 'On se retrouve à El Menzah ? Quelqu\'un peut me covoiturer ?', timestamp: '14:22', },
  { id: 'msg8', roomId: 'cr1', authorId: 'u1', authorName: 'Ahmed', authorAvatar: '👤', text: 'Oui ! Je peux passer te prendre Sami. RDV devant la station à 19h30', timestamp: '14:25', },
  { id: 'msg9', roomId: 'cr1', authorId: 'u2', authorName: 'Youssef', authorAvatar: '🧑', text: 'N\'oubliez pas de payer avant le match svp 💰', timestamp: '14:28', },
  { id: 'msg10', roomId: 'cr1', authorId: 'u1', authorName: 'Ahmed', authorAvatar: '👤', text: 'On commence à 20h pile ! Soyez à l\'heure 🕗', timestamp: '14:30', },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'match_invite', title: 'Nouvelle invitation', message: 'Youssef t\'invite au "Foot du Dimanche 🏆"', time: 'Il y a 5 min', read: false },
  { id: 'n2', type: 'payment', title: 'Paiement confirmé', message: 'Ta place pour "Match du Vendredi Soir" est confirmée (15 DT)', time: 'Il y a 30 min', read: false },
  { id: 'n3', type: 'tournament', title: 'Finale demain !', message: 'La finale de la Coupe Ramadan est demain à 20h 🏆', time: 'Il y a 2h', read: false },
  { id: 'n4', type: 'match_confirmed', title: 'Match confirmé', message: '"Ennasr — Match Rapide" est confirmé pour ce soir à 18h', time: 'Il y a 3h', read: true },
  { id: 'n5', type: 'chat', title: 'Nouveau message', message: 'Sami : Qui est dispo samedi ?', time: 'Hier', read: true },
  { id: 'n6', type: 'system', title: 'Bienvenue !', message: 'Ton profil est à 80%. Complète-le pour plus de matchs.', time: 'Il y a 2 jours', read: true },
];

export const adminStats = {
  totalUsers: 1247,
  activeMatches: 34,
  totalRevenue: 12580,
  activeTournaments: 3,
  weeklyGrowth: 12.5,
  matchesThisWeek: 89,
  avgPlayersPerMatch: 11.2,
  topCities: [
    { city: 'Tunis', users: 523, matches: 45 },
    { city: 'Sfax', users: 234, matches: 22 },
    { city: 'Sousse', users: 198, matches: 18 },
    { city: 'Bizerte', users: 112, matches: 10 },
    { city: 'Nabeul', users: 89, matches: 8 },
  ],
  revenueByMonth: [
    { month: 'Sep', revenue: 1200 },
    { month: 'Oct', revenue: 1800 },
    { month: 'Nov', revenue: 2100 },
    { month: 'Dec', revenue: 1900 },
    { month: 'Jan', revenue: 2500 },
    { month: 'Fév', revenue: 3080 },
  ],
};
