import {FieldValue} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {user} from "firebase-functions/v1/auth";
import {db} from "../config/firebase.js";

export const createUserProfile = user().onCreate(async (userRecord) => {
  await db.collection("users").doc(userRecord.uid).set({
    name: userRecord.displayName || userRecord.email || "Joueur",
    email: userRecord.email || "",
    avatar: "👤",
    phone: "",
    city: "Tunisie",
    level: "Débutant",
    position: "Milieu",
    rating: 0,
    matchesPlayed: 0,
    goals: 0,
    assists: 0,
    role: "user",
    joined: new Date().toISOString().split("T")[0],
    createdAt: FieldValue.serverTimestamp(),
  }, {merge: true});

  logger.info("User profile created", {uid: userRecord.uid});
});
