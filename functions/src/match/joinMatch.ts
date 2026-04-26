import {FieldValue} from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import {onCall} from "firebase-functions/v2/https";
import {db} from "../config/firebase.js";
import {requireAuth} from "../utils/auth.js";
import {failedPrecondition, notFound} from "../utils/errors.js";
import {ensureArray, ensureNonEmptyString} from "../utils/validators.js";
import {buildPlayer, getUserProfileOrThrow, MatchDocument, MatchPlayer} from "./shared.js";

export const joinMatch = onCall(async (request) => {
  const userId = requireAuth(request);
  const matchId = ensureNonEmptyString(request.data?.matchId, "matchId");
  const userProfile = await getUserProfileOrThrow(userId);
  const joiningPlayer = buildPlayer(userId, userProfile);
  const matchRef = db.collection("matches").doc(matchId);

  await db.runTransaction(async (transaction) => {
    const matchSnap = await transaction.get(matchRef);
    if (!matchSnap.exists) {
      notFound("Match not found.");
    }

    const matchData = matchSnap.data() as MatchDocument;
    const currentPlayers = ensureArray<MatchPlayer>(matchData.players);

    if (currentPlayers.some((player) => player.userId === userId)) {
      failedPrecondition("Already joined.");
    }

    if (matchData.status !== "open") {
      failedPrecondition("Match is not open.");
    }

    if (currentPlayers.length >= matchData.maxPlayers) {
      failedPrecondition("Match is already full.");
    }

    const updatedPlayers = [...currentPlayers, joiningPlayer];
    transaction.update(matchRef, {
      players: updatedPlayers,
      currentPlayers: updatedPlayers.length,
      status: updatedPlayers.length >= matchData.maxPlayers ? "full" : "open",
      updatedAt: FieldValue.serverTimestamp(),
    });
  });

  logger.info("Player joined match", {matchId, userId});
  return {success: true};
});
