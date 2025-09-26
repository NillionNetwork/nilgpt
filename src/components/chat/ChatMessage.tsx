"use client";

import Image from "next/image";
import type React from "react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { IChatMessage } from "../../types/chat";
import getMessageAttachmentIcon from "../../utils/getMessageAttachmentIcon";

interface ChatMessageProps {
  message: IChatMessage;
  isStreaming?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming = false,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      const isDark =
        document.documentElement.classList.contains("theme-dark-blue") ||
        document.documentElement.classList.contains("theme-dark-sepia");
      setIsDarkMode(isDark);
    };

    checkTheme();

    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        // Reset to copy icon after 2 seconds
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
      });
  };

  const isUser = message.role === "user";

  const bubbleClasses = `
    rounded-tl-2xl rounded-tr rounded-br-2xl rounded-bl-2xl px-6 py-3 max-w-[80%] sm:max-w-[75%] lg:max-w-[65%]
    break-words overflow-wrap-anywhere
    ${isUser ? "bg-[var(--card)] text-[var(--card-foreground)]" : "bg-transparent text-[var(--foreground)]"}
  `;

  const markdownProseClasses = `
    ${isUser ? "prose prose-invert text-[var(--card-foreground)]" : "prose text-[var(--foreground)]"}
      prose-sm sm:prose-base
      max-w-none
      break-words overflow-wrap-anywhere
  `;

  return (
    <>
      {message.attachments && message.attachments.length > 0 && (
        <div className="flex gap-1 items-center !-mb-2 ml-auto w-fit">
          <span className="text-[var(--muted-foreground)] text-xs">
            Attached
          </span>
          <div className="flex gap-1 items-center">
            {message.attachments.map((attachment) => {
              const AttachmentIcon = getMessageAttachmentIcon(attachment);
              return (
                <div key={attachment}>
                  <AttachmentIcon
                    size={12}
                    className="text-[var(--muted-foreground)]"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
        <div className={bubbleClasses}>
          <div className={markdownProseClasses}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content as string}
            </ReactMarkdown>
          </div>

          {!isUser &&
            (isStreaming ? (
              <span className="inline-block w-2 h-4 bg-[var(--muted-foreground)] animate-pulse ml-1 align-text-bottom" />
            ) : (
              message.content && (
                <div className="flex mt-2 space-x-2">
                  <button
                    onClick={() => copyToClipboard(message.content as string)}
                    className={`p-1 hover:text-[var(--foreground)] ${
                      isDarkMode
                        ? "text-white"
                        : "text-[var(--muted-foreground)]"
                    }`}
                    title={isCopied ? "Copied!" : "Copy to clipboard"}
                  >
                    <Image
                      src={
                        isCopied ? "/img/tick_icon.svg" : "/img/copy-icon.png"
                      }
                      width={12}
                      height={12}
                      alt={isCopied ? "copied" : "copy-icon"}
                      className={isDarkMode ? "invert" : ""}
                    />
                  </button>
                </div>
              )
            ))}
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
