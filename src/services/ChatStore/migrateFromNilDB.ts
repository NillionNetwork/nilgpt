import { LOCAL_STORAGE_KEY_MAP } from "@/services/LocalStorage/constants";
import { ChatStore } from ".";
import type { IStoredChat, IStoredMessage } from "./types";

export type TMigrationResult =
  | { status: "already-migrated" }
  | { status: "unavailable" }
  | { status: "migrated"; chatCount: number }
  | { status: "failed"; error: unknown };

const MESSAGE_FETCH_CONCURRENCY = 4;

const migrationFlagKey = (userId: string) =>
  `${LOCAL_STORAGE_KEY_MAP.NILDB_MIGRATED}:${userId}`;

export const isMigrated = (userId: string) =>
  localStorage.getItem(migrationFlagKey(userId)) !== null;

export const clearMigrationFlag = (userId: string) =>
  localStorage.removeItem(migrationFlagKey(userId));

// nilDB returns secret-shared fields either unwrapped or as { "%allot": value }
const unwrapAllot = (value: unknown): string => {
  if (value && typeof value === "object" && "%allot" in value) {
    return String((value as { "%allot": unknown })["%allot"]);
  }
  return typeof value === "string" ? value : "";
};

const toStoredChat = (
  // biome-ignore lint/suspicious/noExplicitAny: nilDB record shape
  chat: any,
  userId: string,
): IStoredChat => {
  const createdAt =
    chat.created_at ?? chat._created ?? new Date().toISOString();
  return {
    _id: chat._id,
    creator: chat.creator ?? userId,
    title: unwrapAllot(chat.title),
    created_at: createdAt,
    updated_at: chat.updated_at ?? createdAt,
    message_count: Number(chat.message_count ?? 0),
    ...(chat.persona && { persona: chat.persona }),
  };
};

const toStoredMessage = (
  // biome-ignore lint/suspicious/noExplicitAny: nilDB record shape
  message: any,
  userId: string,
): IStoredMessage => ({
  _id: message._id,
  chat_id: message.chat_id,
  creator: message.creator ?? userId,
  role: message.role,
  content: unwrapAllot(message.content),
  order: Number(message.order ?? 0),
  timestamp: message.timestamp ?? "",
  model: message.model ?? "",
  ...(message.attachments?.length > 0 && { attachments: message.attachments }),
  ...(message.sources?.length > 0 && { sources: message.sources }),
  ...(message.pwa === true && { pwa: true }),
  ...(message.web_search === true && { web_search: true }),
});

const fetchJson = async (url: string) => {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    throw new Error(`${url} failed: ${response.status}`);
  }
  return response.json();
};

const runMigration = async (userId: string): Promise<TMigrationResult> => {
  if (isMigrated(userId)) {
    return { status: "already-migrated" };
  }

  try {
    const { available } = await fetchJson("/api/nildb-status");
    if (!available) {
      return { status: "unavailable" };
    }
  } catch {
    return { status: "unavailable" };
  }

  try {
    const chatsData = await fetchJson("/api/getChats");
    const chats: IStoredChat[] = (chatsData.content?.result ?? []).map(
      // biome-ignore lint/suspicious/noExplicitAny: nilDB record shape
      (c: any) => toStoredChat(c, userId),
    );

    // Only import chats whose messages were fetched, so a chat is never
    // stored half-complete. Failed chats are retried on the next run.
    const importedChats: IStoredChat[] = [];
    const messages: IStoredMessage[] = [];
    let failedChats = 0;
    for (let i = 0; i < chats.length; i += MESSAGE_FETCH_CONCURRENCY) {
      const batch = chats.slice(i, i + MESSAGE_FETCH_CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map((chat) =>
          fetchJson(`/api/getChatMessages/${encodeURIComponent(chat._id)}`),
        ),
      );
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          failedChats++;
          return;
        }
        importedChats.push(batch[index]);
        for (const message of result.value.content ?? []) {
          messages.push(toStoredMessage(message, userId));
        }
      });
    }

    await ChatStore.importRecords(importedChats, messages);

    if (failedChats > 0) {
      throw new Error(`Failed to fetch messages for ${failedChats} chats`);
    }

    localStorage.setItem(migrationFlagKey(userId), new Date().toISOString());

    return { status: "migrated", chatCount: chats.length };
  } catch (error) {
    console.error("nilDB migration failed:", error);
    return { status: "failed", error };
  }
};

const inFlight = new Map<string, Promise<TMigrationResult>>();

/**
 * Copy the user's chats from nilDB into this device's local store, once.
 * Safe to call repeatedly: concurrent calls share a single run, and a failed
 * or unavailable run is retried on the next call.
 */
export const migrateFromNilDB = (userId: string): Promise<TMigrationResult> => {
  const existing = inFlight.get(userId);
  if (existing) return existing;

  const run = runMigration(userId).finally(() => inFlight.delete(userId));
  inFlight.set(userId, run);
  return run;
};
