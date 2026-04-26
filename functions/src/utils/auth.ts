import {CallableRequest} from "firebase-functions/v2/https";
import {unauthenticated} from "./errors.js";

export function requireAuth(request: CallableRequest<unknown>): string {
  const uid = request.auth?.uid;
  if (!uid) {
    unauthenticated();
  }

  return uid;
}
