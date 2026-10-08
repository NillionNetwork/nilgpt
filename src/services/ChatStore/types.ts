import type { IWebSearchSource } from "@/types/chat";
import type { TMessageAttachment } from "@/types/schemas";

// Titles and message contents hold the client-side ciphertext produced with
// the user's passphrase, exactly as they were sent to nilDB before.
export interface IStoredChat {
  _id: string;
  creator: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  persona?: string;
}

export interface IStoredMessage {
  _id: string;
  chat_id: string;
  creator: string;
  role: "user" | "assistant";
  content: string;
  order: number;
  timestamp: string;
  model: string;
  attachments?: TMessageAttachment[];
  sources?: IWebSearchSource[];
  pwa?: boolean;
  web_search?: boolean;
}
