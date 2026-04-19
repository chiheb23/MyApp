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
  limit,
  arrayUnion
} from "firebase/firestore";
import { getToken, onMessage } from "firebase/messaging";
import { db, messaging } from "../firebase";
import { Notification as AppNotification } from "../types";

const NOTIFICATIONS_COLLECTION = "notifications";

export const notificationService = {
  // Demander la permission et récupérer le token FCM
  async requestPermission(userId: string) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "VOTRE_VAPID_KEY_DE_LA_CONSOLE_FIREBASE" // À remplacer par l'utilisateur
        });
        
        if (token) {
          // Sauvegarder le token dans le profil utilisateur pour l'envoi push
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, {
            fcmTokens: arrayUnion(token)
          });
          return token;
        }
      }
    } catch (error) {
      console.error("Erreur lors de la demande de permission notification:", error);
    }
    return null;
  },

  // Écouter les messages quand l'app est au premier plan
  onForegroundMessage() {
    onMessage(messaging, (payload) => {
      console.log("Message reçu au premier plan:", payload);
      if (Notification.permission === "granted") {
        new Notification(payload.notification?.title || "KooraTime", {
          body: payload.notification?.body,
          icon: "/favicon.ico"
        });
      }
    });
  },

  // Écouter les notifications d'un utilisateur en temps réel (In-app)
  subscribeToNotifications(userId: string, callback: (notifications: AppNotification[]) => void) {
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
        } as AppNotification;
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

  // Créer une notification (In-app)
  async createNotification(notificationData: Omit<AppNotification, 'id' | 'time'>) {
    try {
      await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
        ...notificationData,
        timestamp: Timestamp.now(),
        read: false
      });
    } catch (error) {
      throw error;
    }
  },

  // Notifier le créateur quand quelqu'un rejoint son match
  async notifyMatchJoined(ownerId: string, playerName: string, matchTitle: string) {
    await this.createNotification({
      userId: ownerId,
      title: "Nouveau joueur ! 🏃",
      message: `${playerName} a rejoint ton match "${matchTitle}"`,
      type: "match_confirmed"
    } as any);
  }
};
