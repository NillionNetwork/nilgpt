import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { TLLMName } from "@/config/llm";
import type { IChatMessage, IWebSearchSource } from "../types/chat";

export interface UseStreamingChatOptions {
  model?: TLLMName;
  shouldUseWebSearch?: boolean;
  onUpdate?: (content: string) => void;
  onComplete?: (
    content: string,
    sources?: IWebSearchSource[],
    webSearchUsed?: boolean,
  ) => void;
  onError?: (error: string) => void;
}

export function useStreamingChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);

  const sendMessage = useCallback(
    async (
      messages: IChatMessage[],
      options: UseStreamingChatOptions = {},
      persona?: string,
    ): Promise<string> => {
      const { onUpdate, onComplete, onError, shouldUseWebSearch, model } =
        options;

      setIsLoading(true);
      setIsStreaming(false);
      setIsSearchingWeb(!!shouldUseWebSearch);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages,
            stream: true,
            persona,
            web_search: !!shouldUseWebSearch,
            model,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No reader available");
        }

        const decoder = new TextDecoder();
        let accumulatedContent = "";
        let webSearchSources: IWebSearchSource[] = [];
        let webSearchUsed = false;

        setIsLoading(false);
        setIsStreaming(true);

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              const trimmedLine = line.trim();

              if (trimmedLine === "") continue;
              if (trimmedLine === "data: [DONE]") continue;

              if (trimmedLine.startsWith("data: ")) {
                try {
                  const jsonStr = trimmedLine.slice(6);
                  const parsed = JSON.parse(jsonStr);

                  const content = parsed.choices?.[0]?.delta?.content || "";
                  const sources: IWebSearchSource[] = parsed?.sources ?? [];

                  if (content) {
                    accumulatedContent += content;
                    onUpdate?.(accumulatedContent);
                  }

                  if (sources.length > 0) {
                    webSearchSources = sources.map(
                      (source: IWebSearchSource) => ({
                        source: source.source,
                      }),
                    );
                  }
                } catch (parseError) {
                  console.warn("Failed to parse streaming chunk:", parseError);
                }
              }
            }
          }
        } finally {
          const rateLimitReached = response.headers.get("X-Rate-Limit-Reached");
          if (rateLimitReached === "true") {
            toast.info(
              "You have reached the daily limit for web search. Your prompt was routed to the model without web search.",
              { duration: 8000 },
            );
            webSearchUsed = false; // Rate limit reached, web search was not used
          } else {
            // Web search was used if we requested it and didn't hit rate limit
            webSearchUsed = !!shouldUseWebSearch;
          }
          reader.releaseLock();
        }

        setIsStreaming(false);
        onComplete?.(accumulatedContent, webSearchSources, webSearchUsed);
        return accumulatedContent;
      } catch (error) {
        setIsLoading(false);
        setIsStreaming(false);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        onError?.(errorMessage);
        throw error;
      } finally {
        setIsSearchingWeb(false);
      }
    },
    [],
  );

  return {
    sendMessage,
    isLoading,
    isStreaming,
    isSearchingWeb,
  };
}
