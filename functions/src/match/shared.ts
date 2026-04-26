import {FieldValue} from "firebase-admin/firestore";
import {db} from "../config/firebase.js";
import {failedPrecondition, notFound} from "../utils/errors.js";
import {ensureActivePlace, ensureNonEmptyString, ensureNumber} from "../utils/validators.js";

export interface UserProfile {
  name?: string;
  email?: string;
  avatar?: string;
  position?: string;
  rating?: number;
  role?: string;
}

export interface PlaceData {
  name?: string;
  city?: string;
  address?: string;
  lat?: number;
  lng?: number;
  isActive?: boolean;
}

export interface MatchPlayer {
  userId: string;
  name: string;
  avatar: string;
  position: string;
  rating: number;
  paid: boolean;
}

export interface MatchDocument {
  title: string;
  placeId: string;
  datetime: string;
  duration: number;
  maxPlayers: number;
  fee: number;
  type: "5v5" | "7v7" | "11v11";
  description?: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  placeName: string;
  placeCity: string;
  placeAddress: string;
  lat: number;
  lng: number;
  currentPlayers: number;
  status: "open" | "full" | "cancelled";
  players: MatchPlayer[];
  createdAt?: FieldValue;
  updatedAt?: FieldValue;
}

export function buildPlayer(userId: string, userProfile: UserProfile): MatchPlayer {
  return {
    userId,
    name: ensureNonEmptyString(userProfile.name, "user.name"),
    avatar: typeof userProfile.avatar === "string" && userProfile.avatar.trim() ?
      userProfile.avatar :
      "👤",
    position: typeof userProfile.position === "string" && userProfile.position.trim() ?
      userProfile.position :
      "Milieu",
    rating: typeof userProfile.rating === "number" ? userProfile.rating : 0,
    paid: false,
  };
}

export async function getUserProfileOrThrow(userId: string): Promise<UserProfile> {
  const userSnap = await db.collection("users").doc(userId).get();
  if (!userSnap.exists) {
    failedPrecondition("User profile must exist before calling this action.");
  }

  return userSnap.data() as UserProfile;
}

export async function getPlaceOrThrow(placeId: string): Promise<PlaceData> {
  const placeSnap = await db.collection("places").doc(placeId).get();
  if (!placeSnap.exists) {
    notFound("Selected place was not found.");
  }

  const place = placeSnap.data() as PlaceData;
  ensureActivePlace(place.isActive);
  return place;
}

export function buildMatchLocation(place: PlaceData) {
  return {
    placeName: ensureNonEmptyString(place.name, "place.name"),
    placeCity: ensureNonEmptyString(place.city, "place.city"),
    placeAddress: ensureNonEmptyString(place.address, "place.address"),
    lat: ensureNumber(place.lat, "place.lat", -90, 90),
    lng: ensureNumber(place.lng, "place.lng", -180, 180),
  };
}
