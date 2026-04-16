import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  limit
} from "firebase/firestore";
import { db } from "../firebase";
import { Notification } from "../types";

const NOTIFICATIONS_COLLECTION = "notifications";

export const notificationService = {
  // Écouter les notifications d'un utilisateur en temps réel
  subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          time: data.timestamp?.toDate().toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' }) || ''
        } as Notification;
      });
      callback(notifications);
    });
  },

  // Marquer une notification comme lue
  async markAsRead(notificationId: string) {
    try {
      const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
      await updateDoc(docRef, { read: true });
    } catch (error) {
      throw error;
    }
  },

  // Créer une notification
  async createNotification(notificationData: Omit<Notification, 'id' | 'time'>) {
    try {
      await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
        ...notificationData,
        timestamp: Timestamp.now(),
        read: false
      });
    } catch (error) {
      throw error;
    }
  }
};
