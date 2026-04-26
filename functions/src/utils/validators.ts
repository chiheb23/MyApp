import {failedPrecondition, invalidArgument} from "./errors.js";

export type MatchType = "5v5" | "7v7" | "11v11";

export interface CreateMatchInput {
  title: string;
  placeId: string;
  datetime: string;
  duration: number;
  maxPlayers: number;
  fee: number;
  type: MatchType;
  description?: string;
}

export const allowedMatchSizes: Record<MatchType, number> = {
  "5v5": 10,
  "7v7": 14,
  "11v11": 22,
};

export function ensureNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    invalidArgument(`${field} is required.`);
  }

  return value.trim();
}

export function ensureNumber(
  value: unknown,
  field: string,
  min: number,
  max?: number,
): number {
  if (typeof value !== "number" || Number.isNaN(value) || value < min) {
    invalidArgument(`${field} is invalid.`);
  }

  if (max !== undefined && value > max) {
    invalidArgument(`${field} is invalid.`);
  }

  return value;
}

export function ensureMatchType(value: unknown): MatchType {
  if (value !== "5v5" && value !== "7v7" && value !== "11v11") {
    invalidArgument("type is invalid.");
  }

  return value;
}

export function validateCreateMatchInput(data: Partial<CreateMatchInput>) {
  const title = ensureNonEmptyString(data.title, "title");
  const placeId = ensureNonEmptyString(data.placeId, "placeId");
  const datetime = ensureNonEmptyString(data.datetime, "datetime");
  const duration = ensureNumber(data.duration, "duration", 30, 240);
  const fee = ensureNumber(data.fee, "fee", 0, 10000);
  const type = ensureMatchType(data.type);
  const maxPlayers = ensureNumber(data.maxPlayers, "maxPlayers", 2, 30);

  if (allowedMatchSizes[type] !== maxPlayers) {
    invalidArgument("maxPlayers does not match match type.");
  }

  const scheduledAt = new Date(datetime);
  if (Number.isNaN(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()) {
    invalidArgument("datetime must be in the future.");
  }

  return {
    title,
    placeId,
    datetime: scheduledAt.toISOString(),
    duration,
    fee,
    type,
    maxPlayers,
    description: typeof data.description === "string" ? data.description.trim() : "",
  };
}

export function ensureArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value as T[] : [];
}

export function ensureActivePlace(isActive?: boolean) {
  if (isActive === false) {
    failedPrecondition("Selected place is inactive.");
  }
}
