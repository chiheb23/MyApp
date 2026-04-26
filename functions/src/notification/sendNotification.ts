import {Timestamp} from "firebase-admin/firestore";
import {db} from "../config/firebase.js";

interface NotificationPayload {
  userId: string;
  type: "match_invite" | "match_confirmed" | "payment" | "tournament" | "chat" | "system";
  title: string;
  message: string;
  actionUrl?: string;
}

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  await db.collection("notifications").add({
    ...payload,
    read: false,
    timestamp: Timestamp.now(),
  });
}
