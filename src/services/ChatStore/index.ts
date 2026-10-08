import type { IStoredChat, IStoredMessage } from "./types";

const DB_NAME = "nilgpt";
const DB_VERSION = 1;
const CHATS_STORE = "chats";
const MESSAGES_STORE = "messages";

type TStoreName = typeof CHATS_STORE | typeof MESSAGES_STORE;

let dbPromise: Promise<IDBDatabase> | null = null;

const openDB = (): Promise<IDBDatabase> => {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(CHATS_STORE)) {
        const chats = db.createObjectStore(CHATS_STORE, { keyPath: "_id" });
        chats.createIndex("creator", "creator");
      }
      if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
        const messages = db.createObjectStore(MESSAGES_STORE, {
          keyPath: "_id",
        });
        messages.createIndex("chat_id", "chat_id");
        messages.createIndex("creator", "creator");
      }
    };

    request.onsuccess = () => {
      // Ask the browser not to evict chats under storage pressure (best effort)
      navigator.storage?.persist?.().catch(() => {});
      resolve(request.result);
    };
    request.onerror = () => {
      dbPromise = null;
      reject(request.error);
    };
  });

  return dbPromise;
};

const requestToPromise = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const transactionDone = (tx: IDBTransaction): Promise<void> =>
  new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });

const getAllByIndex = async <T>(
  storeName: TStoreName,
  indexName: string,
  value: string,
): Promise<T[]> => {
  const db = await openDB();
  const tx = db.transaction(storeName, "readonly");
  return requestToPromise(
    tx.objectStore(storeName).index(indexName).getAll(value),
  ) as Promise<T[]>;
};

const deleteByIndex = (
  store: IDBObjectStore,
  indexName: string,
  value: string,
) => {
  const request = store.index(indexName).openKeyCursor(value);
  request.onsuccess = () => {
    const cursor = request.result;
    if (cursor) {
      store.delete(cursor.primaryKey);
      cursor.continue();
    }
  };
};

export const ChatStore = {
  getChats: async (userId: string): Promise<IStoredChat[]> => {
    const chats = await getAllByIndex<IStoredChat>(
      CHATS_STORE,
      "creator",
      userId,
    );
    // Most recent first
    return chats.sort((a, b) =>
      (b.created_at ?? "").localeCompare(a.created_at ?? ""),
    );
  },

  createChat: async (chat: IStoredChat): Promise<void> => {
    const db = await openDB();
    const tx = db.transaction(CHATS_STORE, "readwrite");
    tx.objectStore(CHATS_STORE).put(chat);
    await transactionDone(tx);
  },

  updateChat: async (
    chatId: string,
    updates: Partial<Pick<IStoredChat, "title" | "message_count">>,
  ): Promise<void> => {
    const db = await openDB();
    const tx = db.transaction(CHATS_STORE, "readwrite");
    const store = tx.objectStore(CHATS_STORE);
    const request = store.get(chatId);
    request.onsuccess = () => {
      if (!request.result) return;
      store.put({
        ...request.result,
        ...updates,
        updated_at: new Date().toISOString(),
      });
    };
    await transactionDone(tx);
  },

  deleteChat: async (chatId: string): Promise<void> => {
    const db = await openDB();
    const tx = db.transaction([CHATS_STORE, MESSAGES_STORE], "readwrite");
    tx.objectStore(CHATS_STORE).delete(chatId);
    deleteByIndex(tx.objectStore(MESSAGES_STORE), "chat_id", chatId);
    await transactionDone(tx);
  },

  getMessages: async (
    userId: string,
    chatId: string,
  ): Promise<IStoredMessage[]> => {
    const messages = await getAllByIndex<IStoredMessage>(
      MESSAGES_STORE,
      "chat_id",
      chatId,
    );
    return messages
      .filter((message) => message.creator === userId)
      .sort((a, b) => a.order - b.order);
  },

  getUserMessages: (userId: string): Promise<IStoredMessage[]> =>
    getAllByIndex<IStoredMessage>(MESSAGES_STORE, "creator", userId),

  addMessage: async (message: IStoredMessage): Promise<void> => {
    const db = await openDB();
    const tx = db.transaction(MESSAGES_STORE, "readwrite");
    tx.objectStore(MESSAGES_STORE).put(message);
    await transactionDone(tx);
  },

  /**
   * Overwrite existing messages. Messages that no longer exist (e.g. their
   * chat was deleted meanwhile) are not recreated.
   */
  replaceMessages: async (messages: IStoredMessage[]): Promise<void> => {
    const db = await openDB();
    const tx = db.transaction(MESSAGES_STORE, "readwrite");
    const store = tx.objectStore(MESSAGES_STORE);
    for (const message of messages) {
      const request = store.getKey(message._id);
      request.onsuccess = () => {
        if (request.result !== undefined) store.put(message);
      };
    }
    await transactionDone(tx);
  },

  /**
   * Bulk import, used for the nilDB migration. Records that already exist
   * locally are kept as-is so local changes are never overwritten.
   */
  importRecords: async (
    chats: IStoredChat[],
    messages: IStoredMessage[],
  ): Promise<void> => {
    const db = await openDB();
    const tx = db.transaction([CHATS_STORE, MESSAGES_STORE], "readwrite");
    const chatStore = tx.objectStore(CHATS_STORE);
    const messageStore = tx.objectStore(MESSAGES_STORE);

    const [chatKeys, messageKeys] = await Promise.all([
      requestToPromise(chatStore.getAllKeys()),
      requestToPromise(messageStore.getAllKeys()),
    ]);
    const existingChats = new Set(chatKeys);
    const existingMessages = new Set(messageKeys);

    for (const chat of chats) {
      if (!existingChats.has(chat._id)) chatStore.put(chat);
    }
    for (const message of messages) {
      if (!existingMessages.has(message._id)) messageStore.put(message);
    }

    await transactionDone(tx);
  },

  deleteUserData: async (userId: string): Promise<void> => {
    const db = await openDB();
    const tx = db.transaction([CHATS_STORE, MESSAGES_STORE], "readwrite");
    deleteByIndex(tx.objectStore(CHATS_STORE), "creator", userId);
    deleteByIndex(tx.objectStore(MESSAGES_STORE), "creator", userId);
    await transactionDone(tx);
  },
};
