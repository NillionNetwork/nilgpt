import {
  decryptMessage,
  encryptMessage,
  isEncryptedContent,
} from "@/lib/encryption/blindfold";
import { ChatStore } from ".";
import type { IStoredMessage } from "./types";

/**
 * Encrypt any stored messages that are not yet encrypted, in place, with the
 * user's passphrase.
 *
 * A chat is only re-encrypted once the passphrase has decrypted something
 * else in that same chat, so a mistyped passphrase can never lock a user out
 * of their own messages.
 */
const runEncryption = async (
  userId: string,
  secretKeySeed: string,
): Promise<number> => {
  const messages = await ChatStore.getUserMessages(userId);

  const byChat = new Map<string, IStoredMessage[]>();
  for (const message of messages) {
    const group = byChat.get(message.chat_id) ?? [];
    group.push(message);
    byChat.set(message.chat_id, group);
  }

  const chatsById = new Map(
    (await ChatStore.getChats(userId)).map((chat) => [chat._id, chat]),
  );

  const updated: IStoredMessage[] = [];
  for (const [chatId, chatMessages] of Array.from(byChat)) {
    const plaintext = chatMessages.filter(
      (message) => message.content && !isEncryptedContent(message.content),
    );
    if (plaintext.length === 0) continue;

    const title = chatsById.get(chatId)?.title;
    const sample =
      chatMessages.find(
        (message) => message.content && isEncryptedContent(message.content),
      )?.content ?? (title && isEncryptedContent(title) ? title : undefined);
    if (!sample) continue;

    const { decryptComplete } = await decryptMessage(sample, secretKeySeed);
    if (!decryptComplete) continue;

    for (const message of plaintext) {
      updated.push({
        ...message,
        content: await encryptMessage(message.content, secretKeySeed),
      });
    }
  }

  if (updated.length > 0) {
    await ChatStore.replaceMessages(updated);
  }
  return updated.length;
};

const inFlight = new Map<string, Promise<number>>();

/**
 * Resolves to the number of messages that were encrypted. Concurrent calls
 * for the same user share a single run.
 */
export const encryptLegacyPlaintext = (
  userId: string,
  secretKeySeed: string,
): Promise<number> => {
  const existing = inFlight.get(userId);
  if (existing) return existing;

  const run = runEncryption(userId, secretKeySeed).finally(() =>
    inFlight.delete(userId),
  );
  inFlight.set(userId, run);
  return run;
};
