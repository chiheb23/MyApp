import {FieldValue} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {onCall} from "firebase-functions/v2/https";
import {db} from "../config/firebase.js";
import {requireAuth} from "../utils/auth.js";
import {validateCreateMatchInput} from "../utils/validators.js";
import {
  buildMatchLocation,
  buildPlayer,
  getPlaceOrThrow,
  getUserProfileOrThrow,
  MatchDocument,
} from "./shared.js";

export const createMatch = onCall(async (request) => {
  const ownerId = requireAuth(request);
  const data = validateCreateMatchInput(request.data as Record<string, unknown>);

  const [userProfile, place] = await Promise.all([
    getUserProfileOrThrow(ownerId),
    getPlaceOrThrow(data.placeId),
  ]);

  const ownerPlayer = buildPlayer(ownerId, userProfile);
  const location = buildMatchLocation(place);

  const matchDoc: MatchDocument = {
    ...data,
    ...location,
    ownerId,
    ownerName: ownerPlayer.name,
    ownerAvatar: ownerPlayer.avatar,
    currentPlayers: 1,
    status: "open",
    players: [ownerPlayer],
    createdAt: FieldValue.serverTimestamp(),
  };

  const matchRef = await db.collection("matches").add(matchDoc);
  logger.info("Match created", {matchId: matchRef.id, ownerId});

  return {matchId: matchRef.id};
});
