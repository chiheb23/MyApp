import {
  addDoc,
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { places as fallbackPlaces } from "../data";
import { db } from "../firebase";
import { Place } from "../types";

const PLACES_COLLECTION = "places";

export const placeService = {
  async createPlace(placeData: Omit<Place, "id">) {
    const docRef = await addDoc(collection(db, PLACES_COLLECTION), {
      ...placeData,
      createdAt: placeData.createdAt || new Date().toISOString(),
      createdAtTimestamp: Timestamp.now(),
    });

    return docRef.id;
  },

  async updatePlace(placeId: string, placeData: Partial<Place>) {
    await updateDoc(doc(db, PLACES_COLLECTION, placeId), {
      ...placeData,
      updatedAt: Timestamp.now(),
    });
  },

  async getPlaceById(placeId: string) {
    const docRef = doc(db, PLACES_COLLECTION, placeId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return fallbackPlaces.find((place) => place.id === placeId) || null;
    }

    return { id: docSnap.id, ...docSnap.data() } as Place;
  },

  subscribeToPlaces(callback: (places: Place[]) => void) {
    const q = query(collection(db, PLACES_COLLECTION), orderBy("name", "asc"), limit(100));

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback(fallbackPlaces.filter((place) => place.isActive));
        return;
      }

      const places = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() } as Place))
        .filter((place) => place.isActive !== false);

      callback(places);
    });
  },

  subscribeToAdminPlaces(adminId: string, callback: (places: Place[]) => void) {
    const q = query(
      collection(db, PLACES_COLLECTION),
      where("adminId", "==", adminId),
      orderBy("name", "asc"),
      limit(100),
    );

    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback(fallbackPlaces.filter((place) => place.adminId === adminId));
        return;
      }

      const places = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Place));
      callback(places);
    });
  },
};
