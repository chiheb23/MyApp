import {setGlobalOptions} from "firebase-functions/v2/options";
import {createMatch} from "./match/createMatch.js";
import {joinMatch} from "./match/joinMatch.js";
import {leaveMatch} from "./match/leaveMatch.js";
import {onMatchJoin} from "./notification/onMatchJoin.js";
import {createUserProfile} from "./user/createUserProfile.js";

setGlobalOptions({maxInstances: 10});

export {
  createMatch,
  joinMatch,
  leaveMatch,
  onMatchJoin,
  createUserProfile,
};
