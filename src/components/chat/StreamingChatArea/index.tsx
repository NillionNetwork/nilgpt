"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TbRefresh } from "react-icons/tb";
import { DEFAULT_MODEL } from "@/config/llm";
import { getPersonaById } from "@/config/personas";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/UnifiedAuthProvider";
import { useEncryption } from "@/hooks/useEncryption";
import useIsPWA from "@/hooks/useIsPWA";
import { useStreamingChat } from "@/hooks/useStreamingChat";
import { LocalStorageService } from "@/services/LocalStorage";
import type { IChatMessage, IWebSearchSource } from "@/types/chat";
import type { TMessageAttachment } from "@/types/schemas";
import getPromptSuggestions from "@/utils/getPromptSuggestions";
import ChatInput from "../ChatInput";
import type { ISendMessageParams } from "../ChatInput/types";
import ChatMessage from "../ChatMessage";
import type { StreamingChatAreaProps } from "./types";

const StreamingChatArea: React.FC<StreamingChatAreaProps> = ({
  initialMessages = [],
  hasDecryptionFailures = false,
}) => {
  const { id: chatId } = useParams<{ id: string }>();
  const [messages, setMessages] = useState<IChatMessage[]>(initialMessages);
  const [isUpdatingChat, setIsUpdatingChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isLoading, isStreaming, isSearchingWeb } =
    useStreamingChat();
  const { user } = useAuth();
  const { setHasMessages, selectedPersona } = useApp();
  const { encrypt, hasSecretKey } = useEncryption();
  const { isPWA } = useIsPWA();

  // Get display name for greeting
  const getUserName = () => {
    if (!user) return "";
    if (user.authProvider === "supabase") {
      return user.name || user.email?.split("@")[0] || "";
    }
    return user.name || "";
  };

  /*
   CHAT
    1. Create Chat (createInitialChat)
        If message_count === 2 (1st user + assistant message)
        Just store in messages. 

    2. Update Chat with Title (updateChatTitle)
        If message_count === 2 (1st user + assistant message)
        We have enough context to summarize the chat for a title

    3. Update chat for message_count purpose (updateChat)
        If message_count >= 3, we can just keep updating message_count
*/

  const createInitialChat = async () => {
    // 1. Check if user is authenticated
    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    // 2. Create Chat with title "null"
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const response = await fetch("/api/createChat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          _id: chatId,
          title: "null",
          message_count: 2,
          persona: selectedPersona,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        return result;
      } else {
        console.error("Error creating CHATS:", result.error);
      }
    } catch (error) {
      console.error("Network error creating chat:", error);
    }
  };

  const updateChatTitle = async (conversationMessages?: IChatMessage[]) => {
    // 1. Call LLM Chat API for summary
    let title = null;

    const summaryMessage: IChatMessage = {
      role: "user",
      content: "Summarize this conversation in three words or less",
    };

    // Use the provided conversation messages or fall back to current messages
    const messagesToUse = conversationMessages || messages;

    try {
      const summaryContent = await sendMessage(
        [...messagesToUse, summaryMessage],
        {},
        selectedPersona,
      );
      title = summaryContent;
    } catch (error) {
      console.error("Error generating title:", error);
      title = "New Chat";
    }

    // 2. Check if user is authenticated
    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    // 3. Clean and encrypt the title if user has secret key
    let encryptedTitle = title;
    if (hasSecretKey && title) {
      try {
        // Clean the title more aggressively
        const cleanedTitle = title
          .trim() // Remove leading/trailing whitespace
          .replace(/[\r\n\t]/g, " ") // Replace newlines, carriage returns, tabs with spaces
          .replace(/\s+/g, " ") // Replace multiple spaces with single space
          .replace(/[^\w\s-]/g, "") // Remove special characters except letters, numbers, spaces, and hyphens
          .trim() // Trim again after character removal
          .substring(0, 100); // Limit to 100 characters max
        encryptedTitle = await encrypt(cleanedTitle);
      } catch (error) {
        console.error("Error encrypting title:", error);
        encryptedTitle = title;
      }
    }

    // 4. Store in database
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const response = await fetch("/api/updateChat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          _id: chatId,
          title: encryptedTitle,
          message_count: 2,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        return result;
      } else {
        console.error("Error updating chat title:", result.error);
      }
    } catch (error) {
      console.error("Network error updating chat title:", error);
    }
  };

  const updateChatCount = async (messageCount: number) => {
    // 2. Check if user is authenticated
    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    // 3. Update Chat via DB
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const response = await fetch("/api/updateChat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          _id: chatId,
          message_count: messageCount,
          noTitle: true,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        return result;
      } else {
        console.error("Error creating CHATS:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const createMessage = async (message: {
    chatId: string;
    role: "user" | "assistant";
    content: string;
    order: number;
    attachments?: TMessageAttachment[];
    sources?: IWebSearchSource[];
    web_search?: boolean;
  }) => {
    const { chatId, role, content, order, attachments, sources, web_search } =
      message;

    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    try {
      // Encrypt the content if the user has a secret key
      let blindfoldContent = content; // Default to plaintext
      if (hasSecretKey) {
        try {
          blindfoldContent = await encrypt(content);
        } catch (error) {
          console.warn("Encryption failed, storing as plaintext:", error);
          blindfoldContent = content;
        }
      }

      const response = await fetch("/api/createMessage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          role: role,
          content: content,
          order: order,
          timestamp: new Date().toISOString(),
          model: DEFAULT_MODEL,
          creator: user?.id,
          blindfoldContent: blindfoldContent,
          attachments,
          sources,
          ...(isPWA && { pwa: true }),
          ...(web_search === true && { web_search: true }),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        return result;
      } else {
        console.error("Error creating message:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  useEffect(() => {
    setHasMessages(messages.length > 0);
  }, [messages, setHasMessages]);

  // Update messages when initialMessages changes
  useEffect(() => {
    // Only update if we don't have messages yet, or if initialMessages is different
    if (messages.length === 0 && initialMessages.length > 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages, messages.length]);

  useEffect(() => {
    if (messages.length > 0 && messages.length !== initialMessages.length) {
      scrollToBottom();
    }
  }, [messages.length, initialMessages.length]);

  const handleSendMessage = async ({
    content,
    model,
    shouldUseWebSearch,
    attachmentData,
  }: ISendMessageParams) => {
    if (!user) {
      console.error("No authenticated user found");
      return;
    }

    if (!content.trim()) return;

    const userMessageContentText = content;
    const userMessageAttachments: TMessageAttachment[] = [];
    const userMessage: IChatMessage = {
      role: "user",
      content,
    };

    if (attachmentData?.imageDataUrl) {
      userMessageAttachments.push("image");
      userMessage.content = [
        { type: "image_url", image_url: { url: attachmentData.imageDataUrl } },
        { type: "text", text: content },
      ];
    }
    if (attachmentData?.pdfData?.extractedTextContent) {
      userMessage.content = [
        {
          type: "text",
          text: `This text extracted from a PDF file. Always refer to this text as an attached PDF file, do not refer to this as "provided text". ${attachmentData.pdfData.extractedTextContent}`,
        },
        { type: "text", text: content },
      ];

      if (attachmentData.pdfData.useAsAttachedFile) {
        userMessageAttachments.push("pdf");
      }
    }

    setMessages((prev) => [
      ...prev,
      {
        ...userMessage,
        content: userMessageContentText,
        attachments: userMessageAttachments,
      },
    ]);

    const assistantMessage: IChatMessage = {
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      await sendMessage(
        [...messages, userMessage],
        {
          model,
          shouldUseWebSearch,
          onUpdate: (streamingContent) => {
            // Update the last message (assistant message) with streaming content
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: streamingContent,
              };
              return updated;
            });
          },
          onComplete: async (finalContent, sources, webSearchUsed) => {
            // Ensure final content is set
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content: finalContent,
                sources,
              };
              return updated;
            });

            // Check if we should create a chat in the database
            const totalMessages = messages.length + 2;

            if (totalMessages === 2) {
              await createInitialChat();
              // Add the two messages to the chat
              await createMessage({
                chatId,
                role: "user",
                content: userMessageContentText,
                order: 1,
                attachments: userMessageAttachments,
              });
              await createMessage({
                chatId,
                role: "assistant",
                content: finalContent,
                order: 2,
                sources,
                web_search: webSearchUsed,
              });

              // Update chat title immediately after first back and forth
              setIsUpdatingChat(true);

              try {
                // Pass the current conversation including the user message and assistant response
                const currentConversation: IChatMessage[] = [
                  ...messages,
                  {
                    role: "user" as const,
                    content: userMessageContentText,
                    attachments: userMessageAttachments,
                  },
                  {
                    role: "assistant" as const,
                    content: finalContent,
                    sources,
                  },
                ];
                await updateChatTitle(currentConversation);
                LocalStorageService.removeUntitledChats();

                if (typeof window !== "undefined") {
                  window.dispatchEvent(new Event("sidebar:refresh"));
                }
              } catch (error) {
                console.warn("Title update failed:", error);
              } finally {
                setTimeout(() => {
                  setIsUpdatingChat(false);
                }, 1000);
              }
            }

            if (totalMessages >= 3) {
              await Promise.all([
                // ODD (User)
                (totalMessages - 1) % 2 === 1
                  ? createMessage({
                      chatId,
                      role: "user",
                      content: userMessageContentText,
                      order: totalMessages - 1,
                      attachments: userMessageAttachments,
                    })
                  : Promise.resolve(),

                // EVEN (Assistant)
                totalMessages % 2 === 0
                  ? createMessage({
                      chatId,
                      role: "assistant",
                      content: finalContent,
                      order: totalMessages,
                      sources,
                      web_search: webSearchUsed,
                    })
                  : Promise.resolve(),
              ]);

              updateChatCount(totalMessages).catch((error) => {
                console.warn("Count update failed:", error);
              });
            }
          },
          onError: (error) => {
            console.error("Streaming error:", error);
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = {
                role: "assistant",
                content:
                  "Sorry, I encountered an error. Please try again later.",
              };
              return updated;
            });
          },
        },
        selectedPersona,
      );
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again later.",
        };
        return updated;
      });
    }

    window.umami.track("Message Sent", {
      persona: getPersonaById(selectedPersona)?.name,
      ...(userMessageAttachments &&
        userMessageAttachments.length > 0 && {
          attachments: userMessageAttachments,
        }),
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
            <div className="hidden dark:block relative mb-8">
              <Image
                src="/img/test_mermaid2.png"
                alt="Nilia Hero Image"
                width={250}
                height={175}
                className="mb-0"
              />
              {user && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-center w-full px-4 md:px-0 md:w-auto">
                  <p
                    className="text-white text-2xl md:text-4xl font-normal leading-tight"
                    style={{ fontFamily: "'Inter Tight', sans-serif" }}
                  >
                    <span className="whitespace-nowrap block">
                      Hey {getUserName()},
                    </span>
                    <span className="block md:whitespace-nowrap">
                      I&apos;m here whenever you need me.
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="w-full max-w-2xl">
              {!hasDecryptionFailures && (
                <ChatInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading || isStreaming || isUpdatingChat}
                  showActionButtons={false}
                />
              )}
            </div>

            <div className="mt-8">
              <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                {getPromptSuggestions(selectedPersona).map(
                  (suggestion, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleSendMessage({ content: suggestion.text })
                      }
                      className="flex items-center space-x-2 p-3 bg-white dark:bg-[#202020] border border-gray-200 dark:border-white/[0.07] rounded-xl hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:border-gray-300 dark:hover:border-white/[0.12] transition-all duration-200 text-left group w-fit"
                    >
                      <div className="text-lg">{suggestion.emoji}</div>
                      <span className="text-sm font-medium text-gray-500 dark:text-white group-hover:text-gray-700 dark:group-hover:text-white">
                        {suggestion.text}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex flex-col-reverse flex-1 overflow-y-auto px-4 py-2 w-full">
            <div ref={messagesEndRef} />
            <div className="max-w-4xl mx-auto w-full mb-auto">
              {messages.map((message, index) => {
                const isLastMessage = index === messages.length - 1;
                const isAssistantStreaming =
                  isLastMessage && message.role === "assistant" && isStreaming;

                return (
                  <ChatMessage
                    key={index}
                    message={message}
                    isStreaming={isAssistantStreaming}
                  />
                );
              })}

              {isLoading &&
                !isStreaming &&
                (isSearchingWeb ? (
                  <span className="text-neutral-600 text-sm animate-pulse ml-6">
                    Searching the web...
                  </span>
                ) : (
                  <TbRefresh
                    size={16}
                    className="animate-spin text-neutral-600 ml-6 -mt-5"
                  />
                ))}
            </div>
          </div>
          {!hasDecryptionFailures && (
            <div className="flex-shrink-0 p-2">
              <div className="max-w-4xl mx-auto w-full">
                <div className="max-w-2xl mx-auto">
                  <ChatInput
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading || isStreaming || isUpdatingChat}
                    showActionButtons={false}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StreamingChatArea;
