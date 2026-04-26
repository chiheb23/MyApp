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
  },
  {
    id: 'place-2',
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
  },
];

export const matches: Match[] = [];
export const tournaments: Tournament[] = [];
export const chatRooms: ChatRoom[] = [];
export const chatMessages: Message[] = [];
export const notifications: Notification[] = [];
