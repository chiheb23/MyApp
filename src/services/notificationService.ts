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
} from 'firebase/firestore';
import { getToken, onMessage } from 'firebase/messaging';
import { db, messaging } from '../firebase';
import { Notification as AppNotification } from '../types';

const NOTIFICATIONS_COLLECTION = 'notifications';

export const notificationService = {
  async requestPermission(userId: string) {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, {
          vapidKey: 'BMZKngLn1qrz0ArIMYd-mp1ueeQlfyJyrG3o0ebp84FP6crMNYzNGXV0_ZjLuV__G7pFZ2iYTxu_hhnT-inYIgs'
        });

        if (token) {
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, {
            fcmTokens: arrayUnion(token)
          });
          return token;
        }
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission notification:', error);
    }
    return null;
  },

  onForegroundMessage() {
    onMessage(messaging, (payload) => {
      console.log('Message recu au premier plan:', payload);
      if (Notification.permission === 'granted') {
        new Notification(payload.notification?.title || 'KooraTime', {
          body: payload.notification?.body,
          icon: '/favicon.ico'
        });
      }
    });
  },

  subscribeToNotifications(userId: string, callback: (notifications: AppNotification[]) => void) {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (querySnapshot) => {
      const notifications = querySnapshot.docs.map((snapshot) => {
        const data = snapshot.data();
        return {
          id: snapshot.id,
          ...data,
          time: data.timestamp?.toDate().toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' }) || ''
        } as AppNotification;
      });
      callback(notifications);
    });
  },

  async markAsRead(notificationId: string) {
    const docRef = doc(db, NOTIFICATIONS_COLLECTION, notificationId);
    await updateDoc(docRef, { read: true });
  },

  async markAllAsRead(notificationIds: string[]) {
    await Promise.all(
      notificationIds.map((notificationId) => this.markAsRead(notificationId))
    );
  },

  async createNotification(notificationData: Omit<AppNotification, 'id' | 'time'>) {
    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
      ...notificationData,
      timestamp: Timestamp.now(),
      read: false
    });
  }
};
