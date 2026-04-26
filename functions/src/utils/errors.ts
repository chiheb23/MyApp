import {HttpsError} from "firebase-functions/v2/https";

export function invalidArgument(message: string): never {
  throw new HttpsError("invalid-argument", message);
}

export function unauthenticated(message = "Authentication required."): never {
  throw new HttpsError("unauthenticated", message);
}

export function notFound(message: string): never {
  throw new HttpsError("not-found", message);
}

export function failedPrecondition(message: string): never {
  throw new HttpsError("failed-precondition", message);
}
