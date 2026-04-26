export type Page = 'landing' | 'dashboard' | 'matches' | 'match-detail' | 'create-match' | 'tournaments' | 'tournament-detail' | 'profile' | 'chat' | 'admin';

export interface User {
  id: string;
  name: string;

  email: string;

  avatar: string;
  phone: string;
  city: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Pro';
  position: string;
  rating: number;
  matchesPlayed: number;
  goals: number;
  assists: number;
  joined: string;
  role: 'user' | 'admin';
}

export interface Match {
  id: string;
  title: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  placeId: string;
  placeName: string;
  placeCity: string;
  placeAddress: string;
  lat: number;
  lng: number;
  datetime: string;
  duration: number;
  maxPlayers: number;
  currentPlayers: number;
  fee: number;
  status: 'open' | 'full' | 'in_progress' | 'completed' | 'cancelled';
  type: '5v5' | '7v7' | '11v11';
  players: MatchPlayer[];
  description?: string;
}

export interface MatchPlayer {
  userId: string;
  name: string;
  avatar: string;
  position: string;
  rating: number;
  paid: boolean;
}

export interface Place {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  pricePerHour: number;
  rating: number;
  image: string;
  amenities: string[];
}

export interface Tournament {
  id: string;
  name: string;
  organizerId: string;
  organizerName: string;
  city: string;
  startDate: string;
  endDate: string;
  maxTeams: number;
  currentTeams: number;
  prizePool: number;
  entryFee: number;
  status: 'registration' | 'in_progress' | 'completed';
  type: '5v5' | '7v7' | '11v11';
  teams: TournamentTeam[];
  bracket: BracketMatch[];
  isLive?: boolean;
}

export interface TournamentTeam {
  id: string;
  name: string;
  logo: string;
  players: string[];
  seed: number;
}

export interface BracketMatch {
  id: string;
  round: number;
  position: number;
  team1?: { name: string; score?: number; logo: string };
  team2?: { name: string; score?: number; logo: string };
  winner?: string;
  isLive?: boolean;
}

export interface Message {
  id: string;
  roomId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'match' | 'tournament' | 'group';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar: string;
  members: number;
}

export interface Notification {
  id: string;
  type: 'match_invite' | 'match_confirmed' | 'payment' | 'tournament' | 'chat' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
}
