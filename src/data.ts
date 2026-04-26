import { ChatRoom, Match, Message, Notification, Place, Tournament, User } from './types';

export const users: User[] = [];

export const currentUser: User = {
  id: 'demo-user',
  name: 'Joueur Demo',
  email: 'demo@example.com',
  avatar: '⚽',
  phone: '',
  city: 'Tunis',
  level: 'Intermédiaire',
  position: 'Milieu',
  rating: 5,
  matchesPlayed: 0,
  goals: 0,
  assists: 0,
  joined: new Date().toISOString().split('T')[0],
  role: 'user',
};

export const places: Place[] = [
  {
    id: 'place-1',
    adminId: 'admin-stade-municipal',
    adminName: 'Admin Stade Municipal',
    name: 'Stade Municipal',
    city: 'Tunis',
    address: 'Centre Ville',
    lat: 36.8065,
    lng: 10.1815,
    phone: '+21600000000',
    pricePerHour: 120,
    rating: 4.5,
    image: '🏟️',
    amenities: ['Parking', 'Vestiaires', 'Eclairage', 'Douches'],
    isActive: true,
    createdAt: '2026-04-20T10:00:00.000Z',
  },
  {
    id: 'place-2',
    adminId: 'admin-arena-lac',
    adminName: 'Admin Arena Lac',
    name: 'Arena Lac',
    city: 'Tunis',
    address: 'Les Berges du Lac',
    lat: 36.8485,
    lng: 10.285,
    phone: '+21600000001',
    pricePerHour: 150,
    rating: 4.7,
    image: '⚽',
    amenities: ['Parking', 'Buvette', 'Eclairage'],
    isActive: true,
    createdAt: '2026-04-20T10:30:00.000Z',
  },
];

export const matches: Match[] = [];
export const tournaments: Tournament[] = [];
export const chatRooms: ChatRoom[] = [
  {
    id: 'room-match-vendredi',
    name: 'Match Vendredi Soir',
    type: 'match',
    lastMessage: 'On se retrouve a 20h15 au terrain.',
    lastMessageTime: '20:10',
    unreadCount: 2,
    avatar: '⚽',
    members: 10,
  },
  {
    id: 'room-tournoi-ramadan',
    name: 'Tournoi Ramadan',
    type: 'tournament',
    lastMessage: 'Le tirage au sort commence demain.',
    lastMessageTime: '18:45',
    unreadCount: 0,
    avatar: '🏆',
    members: 16,
  },
];
export const chatMessages: Message[] = [
  {
    id: 'msg-1',
    roomId: 'room-match-vendredi',
    authorId: 'user-1',
    authorName: 'Youssef',
    authorAvatar: '🧤',
    text: 'Salut tout le monde, qui amene les chasubles ?',
    timestamp: '19:40',
  },
  {
    id: 'msg-2',
    roomId: 'room-match-vendredi',
    authorId: 'user-2',
    authorName: 'Karim',
    authorAvatar: '⚡',
    text: 'Je les amene avec le ballon.',
    timestamp: '19:44',
  },
  {
    id: 'msg-3',
    roomId: 'room-match-vendredi',
    authorId: 'system',
    authorName: 'System',
    authorAvatar: '📢',
    text: 'Le match commence dans 30 minutes.',
    timestamp: '19:50',
    isSystem: true,
  },
  {
    id: 'msg-4',
    roomId: 'room-tournoi-ramadan',
    authorId: 'user-3',
    authorName: 'Mehdi',
    authorAvatar: '🏃',
    text: 'Le tirage sera diffuse en direct sur le groupe.',
    timestamp: '18:45',
  },
];
export const notifications: Notification[] = [];
