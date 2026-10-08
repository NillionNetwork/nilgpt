import { decrypt, encrypt, SecretKey } from "@nillion/blindfold";

// Blindfold encrypts strings of up to 4096 encoded bytes (including a 1-byte
// type tag), so longer messages are split into chunks below that limit.
const MAX_CHUNK_BYTES = 4000;

// Blindfold ciphertext is base64 of nonce (24) + MAC (16) + tag (1) + data,
// so it is never shorter than 56 characters.
const CIPHERTEXT_PATTERN = /^[A-Za-z0-9+/]+={0,2}$/;
const MIN_CIPHERTEXT_LENGTH = 56;

interface IChunkedCiphertext {
  chunks: string[];
}

let cachedKey: { seed: string; key: Promise<SecretKey> } | null = null;

const getKey = (secretKeySeed: string): Promise<SecretKey> => {
  if (cachedKey?.seed !== secretKeySeed) {
    const key = SecretKey.generate(
      { nodes: [{}] },
      { store: true },
      null,
      secretKeySeed,
    );
    key.catch(() => {
      if (cachedKey?.key === key) cachedKey = null;
    });
    cachedKey = { seed: secretKeySeed, key };
  }
  return cachedKey.key;
};

/**
 * Split a string into pieces of at most maxBytes UTF-8 bytes, without
 * breaking a code point across pieces.
 */
const splitUtf8 = (value: string, maxBytes: number): string[] => {
  const chunks: string[] = [];
  let current = "";
  let currentBytes = 0;

  let i = 0;
  while (i < value.length) {
    const codePoint = value.codePointAt(i) ?? 0;
    const char = String.fromCodePoint(codePoint);
    i += char.length;
    const charBytes =
      codePoint < 0x80
        ? 1
        : codePoint < 0x800
          ? 2
          : codePoint < 0x10000
            ? 3
            : 4;
    if (currentBytes + charBytes > maxBytes) {
      chunks.push(current);
      current = "";
      currentBytes = 0;
    }
    current += char;
    currentBytes += charBytes;
  }
  if (current) chunks.push(current);

  return chunks;
};

const parseChunked = (value: string): IChunkedCiphertext | null => {
  if (!value.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(value);
    if (
      Array.isArray(parsed?.chunks) &&
      parsed.chunks.every((chunk: unknown) => typeof chunk === "string")
    ) {
      return parsed;
    }
  } catch {}
  return null;
};

const isSingleCiphertext = (value: string) =>
  value.length >= MIN_CIPHERTEXT_LENGTH &&
  value.length % 4 === 0 &&
  CIPHERTEXT_PATTERN.test(value);

/**
 * Whether a stored value is Blindfold ciphertext (single or chunked).
 */
export const isEncryptedContent = (value: string): boolean =>
  parseChunked(value) !== null || isSingleCiphertext(value);

const encryptString = async (key: SecretKey, value: string) => {
  const ciphertext = await encrypt(key, value);
  return typeof ciphertext === "string"
    ? ciphertext
    : JSON.stringify(ciphertext);
};

/**
 * Encrypts a message using Nillion Blindfold with the provided secret key seed
 * @param message - The plaintext message to encrypt
 * @param secretKeySeed - The user's secret key seed for encryption
 * @returns The encrypted message as a base64-encoded string, or a JSON
 * envelope of base64 chunks for messages over the Blindfold size limit
 */

export async function encryptMessage(
  message: string,
  secretKeySeed: string,
): Promise<string> {
  if (!message || !secretKeySeed) {
    throw new Error(
      "Both message and secretKeySeed are required for encryption",
    );
  }

  if (typeof window === "undefined") {
    console.warn("Encryption is not available on the server");
    return message;
  }

  try {
    const key = await getKey(secretKeySeed);
    const chunks = splitUtf8(message, MAX_CHUNK_BYTES);

    if (chunks.length === 1) {
      return encryptString(key, chunks[0]);
    }

    const envelope: IChunkedCiphertext = {
      chunks: await Promise.all(
        chunks.map((chunk) => encryptString(key, chunk)),
      ),
    };
    return JSON.stringify(envelope);
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
}

/**
 * Decrypts a message using Nillion Blindfold with the provided secret key seed
 * @param encryptedMessage - The encrypted message to decrypt
 * @param secretKeySeed - The user's secret key seed for decryption
 * @returns An object with the decrypted content and a success flag. Content
 * that is not ciphertext is returned as-is and counts as success.
 */

export async function decryptMessage(
  encryptedMessage: string,
  secretKeySeed: string,
): Promise<{ content: string; decryptComplete: boolean }> {
  if (!encryptedMessage || !secretKeySeed) {
    return { content: encryptedMessage || "", decryptComplete: false };
  }

  if (typeof window === "undefined") {
    return { content: encryptedMessage, decryptComplete: false };
  }

  const chunked = parseChunked(encryptedMessage);
  if (!chunked && !isSingleCiphertext(encryptedMessage)) {
    // Not ciphertext, so there is nothing to decrypt
    return { content: encryptedMessage, decryptComplete: true };
  }

  try {
    const key = await getKey(secretKeySeed);
    const ciphertexts = chunked ? chunked.chunks : [encryptedMessage];
    const plaintexts = await Promise.all(
      ciphertexts.map((ciphertext) => decrypt(key, ciphertext)),
    );
    return { content: plaintexts.join(""), decryptComplete: true };
  } catch (error) {
    console.error("Decryption error:", error);
    // If any error occurs during decryption, return the original string
    return { content: encryptedMessage, decryptComplete: false };
  }
}
