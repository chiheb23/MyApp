import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { chatMessages, chatRooms } from "../data";
import { db } from "../firebase";
import { ChatRoom, Message } from "../types";

const MESSAGES_COLLECTION = "messages";
const CHAT_ROOMS_COLLECTION = "chatRooms";

export const chatService = {
  async sendMessage(roomId: string, author: { id: string; name: string; avatar: string }, text: string) {
    try {
      await addDoc(collection(db, MESSAGES_COLLECTION), {
        roomId,
        authorId: author.id,
        authorName: author.name,
        authorAvatar: author.avatar,
        text,
        timestamp: Timestamp.now(),
        isSystem: false,
      });
    } catch (error) {
      throw error;
    }
  },

  subscribeToRooms(callback: (rooms: ChatRoom[]) => void) {
    const q = query(collection(db, CHAT_ROOMS_COLLECTION), limit(50));

    return onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        callback(chatRooms);
        return;
      }

      const rooms = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        unreadCount: 0,
        members: 0,
        avatar: "💬",
        lastMessage: "",
        lastMessageTime: "",
        ...doc.data(),
      })) as ChatRoom[];

      callback(rooms);
    });
  },

  subscribeToMessages(roomId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      where("roomId", "==", roomId),
      orderBy("timestamp", "asc"),
      limit(100),
    );

    return onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.empty) {
        callback(chatMessages.filter((message) => message.roomId === roomId));
        return;
      }

      const messages = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate().toLocaleTimeString("fr-TN", {
            hour: "2-digit",
            minute: "2-digit",
          }) || "",
        } as Message;
      });

      callback(messages);
    });
  },
};
