import {onDocumentUpdated} from "firebase-functions/v2/firestore";
import {MatchPlayer} from "../match/shared.js";
import {sendNotification} from "./sendNotification.js";

export const onMatchJoin = onDocumentUpdated("matches/{matchId}", async (event) => {
  const beforeData = event.data?.before.data();
  const afterData = event.data?.after.data();

  if (!beforeData || !afterData) {
    return;
  }

  const beforePlayers = Array.isArray(beforeData.players) ? beforeData.players as MatchPlayer[] : [];
  const afterPlayers = Array.isArray(afterData.players) ? afterData.players as MatchPlayer[] : [];

  if (afterPlayers.length <= beforePlayers.length) {
    return;
  }

  const joinedPlayer = afterPlayers.find((player) =>
    !beforePlayers.some((existing) => existing.userId === player.userId),
  );

  if (!joinedPlayer || joinedPlayer.userId === afterData.ownerId) {
    return;
  }

  await sendNotification({
    userId: afterData.ownerId,
    type: "match_confirmed",
    title: "Nouveau joueur",
    message: `${joinedPlayer.name} a rejoint ton match "${afterData.title}".`,
    actionUrl: `/match/${event.params.matchId}`,
  });
});
