import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  limit
} from "firebase/firestore";
import { db } from "../firebase";
import { Message } from "../types";

const MESSAGES_COLLECTION = "messages";

export const chatService = {
  // Envoyer un message
  async sendMessage(roomId: string, author: { id: string, name: string, avatar: string }, text: string) {
    try {
      await addDoc(collection(db, MESSAGES_COLLECTION), {
        roomId,
        authorId: author.id,
        authorName: author.name,
        authorAvatar: author.avatar,
        text,
        timestamp: Timestamp.now(),
        isSystem: false
      });
    } catch (error) {
      throw error;
    }
  },

  // Écouter les messages d'un salon en temps réel
  subscribeToMessages(roomId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where("roomId", "==", roomId),
      orderBy("timestamp", "asc"),
      limit(100)
    );

    return onSnapshot(q, (querySnapshot) => {
      const messages = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Conversion du Timestamp Firebase en string pour la compatibilité avec le type Message
          timestamp: data.timestamp?.toDate().toLocaleTimeString('fr-TN', { hour: '2-digit', minute: '2-digit' }) || ''
        } as Message;
      });
      callback(messages);
    });
  }
};
