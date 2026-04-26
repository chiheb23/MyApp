import {FieldValue} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {onCall} from "firebase-functions/v2/https";
import {db} from "../config/firebase.js";
import {requireAuth} from "../utils/auth.js";
import {failedPrecondition, notFound} from "../utils/errors.js";
import {ensureArray, ensureNonEmptyString} from "../utils/validators.js";
import {MatchDocument, MatchPlayer} from "./shared.js";

export const leaveMatch = onCall(async (request) => {
  const userId = requireAuth(request);
  const matchId = ensureNonEmptyString(request.data?.matchId, "matchId");
  const matchRef = db.collection("matches").doc(matchId);

  await db.runTransaction(async (transaction) => {
    const matchSnap = await transaction.get(matchRef);
    if (!matchSnap.exists) {
      notFound("Match not found.");
    }

    const matchData = matchSnap.data() as MatchDocument;
    const currentPlayers = ensureArray<MatchPlayer>(matchData.players);

    if (!currentPlayers.some((player) => player.userId === userId)) {
      failedPrecondition("Player is not part of this match.");
    }

    const updatedPlayers = currentPlayers.filter((player) => player.userId !== userId);

    if (updatedPlayers.length === 0) {
      transaction.update(matchRef, {
        players: [],
        currentPlayers: 0,
        status: "cancelled",
        ownerId: userId,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return;
    }

    const nextOwner = matchData.ownerId === userId ? updatedPlayers[0] : null;
    transaction.update(matchRef, {
      players: updatedPlayers,
      currentPlayers: updatedPlayers.length,
      status: "open",
      ownerId: nextOwner ? nextOwner.userId : matchData.ownerId,
      ownerName: nextOwner ? nextOwner.name : matchData.ownerName,
      ownerAvatar: nextOwner ? nextOwner.avatar : matchData.ownerAvatar,
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  logger.info("Player left match", {matchId, userId});
  return {success: true};
});
