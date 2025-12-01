"use client";

import type React from "react";
import { useState } from "react";
import { TbCheck, TbCopy, TbWorld } from "react-icons/tb";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { IChatMessage } from "../../types/chat";
import getMessageAttachmentIcon from "../../utils/getMessageAttachmentIcon";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

interface ChatMessageProps {
  message: IChatMessage;
  isStreaming?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming = false,
}) => {
  const [isCopied, setIsCopied] = useState(false);

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
    ${isUser ? "bg-white text-black" : "bg-transparent text-black dark:text-white"}
  `;

  const markdownProseClasses = `
    ${isUser ? "prose prose-invert text-black" : "prose dark:prose-invert"}
      prose-sm sm:prose-base
      max-w-none
      break-words overflow-wrap-anywhere
  `;

  return (
    <>
      {message.attachments && message.attachments.length > 0 && (
        <div className="flex gap-1 items-center ml-auto w-fit mb-1">
          <span className="text-neutral-500 dark:text-gray-400 text-xs">
            Attached
          </span>
          <div className="flex gap-1 items-center">
            {message.attachments.map((attachment) => {
              const AttachmentIcon = getMessageAttachmentIcon(attachment);
              return (
                <div key={attachment}>
                  <AttachmentIcon
                    size={14}
                    className="text-neutral-500 dark:text-gray-400"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
        <div className={bubbleClasses}>
          <div className={markdownProseClasses}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content as string}
            </ReactMarkdown>
          </div>

          {!isUser &&
            (isStreaming ? (
              <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse align-text-bottom" />
            ) : (
              message.content && (
                <div className="flex mt-2 space-x-2 gap-1 items-center">
                  <button
                    onClick={() => copyToClipboard(message.content as string)}
                    className="text-neutral-500 dark:text-gray-400 hover:text-neutral-700 dark:hover:text-gray-300"
                    title={isCopied ? "Copied!" : "Copy to clipboard"}
                  >
                    {isCopied ? <TbCheck size={16} /> : <TbCopy size={16} />}
                  </button>

                  {message.sources && message.sources.length > 0 && (
                    <HoverCard openDelay={300}>
                      <HoverCardTrigger className="flex items-center gap-1 group">
                        <TbWorld
                          size={16}
                          className="text-neutral-500 dark:text-gray-400"
                        />
                        <span className="cursor-pointer text-neutral-500 dark:text-gray-400 text-sm group-hover:underline">
                          Sources
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent align="start">
                        <div className="flex mt-2 space-x-2 flex-col">
                          <span className="text-neutral-500 dark:text-gray-400 text-sm">
                            Sources used to generate this response:
                          </span>

                          <ol className="list-decimal list-inside">
                            {message.sources.map(({ source }) => {
                              if (!source.startsWith("http")) {
                                return null;
                              }

                              const sourceUrl = new URL(source);
                              const sourceDomain = sourceUrl.hostname;
                              return (
                                <li key={source}>
                                  <a
                                    href={source}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <span className="text-neutral-500 dark:text-gray-400 text-sm hover:underline">
                                      {sourceDomain}
                                    </span>
                                  </a>
                                </li>
                              );
                            })}
                          </ol>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </div>
              )
            ))}
        </div>
      </div>
    </>
  );
};

export default ChatMessage;
