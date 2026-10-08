import { type NextRequest, NextResponse } from "next/server";
import { DEFAULT_MODEL, getModelConfig, type TLLMName } from "@/config/llm";
import { getPersonaPrompt } from "@/config/personas";
import { requireAuth } from "@/lib/auth/unifiedAuth";
import {
  consumeWebSearch,
  WEB_SEARCH_DAILY_LIMIT,
} from "@/lib/rateLimiting/webSearchRateLimit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const model: TLLMName = body.model || DEFAULT_MODEL;
    const persona = body.persona || "companion";
    const stream = body.stream !== false;
    const webSearch = body.web_search === true; // Default to false if not provided

    const hasSystemMessage = body.messages.some(
      (msg: { role: string }) => msg.role === "system",
    );

    const personaPrompt = getPersonaPrompt(persona);

    // biome-ignore lint/suspicious/noImplicitAnyLet: TODO: add type
    let messages;
    if (!hasSystemMessage) {
      messages = [
        {
          role: "system",
          content: personaPrompt,
        },
        ...body.messages,
      ];
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: TODO: add type
      messages = body.messages.map((message: any) => {
        if (message.role === "system") {
          return {
            ...message,
            content: `${personaPrompt}\n\n${message.content}`,
          };
        }
        return message;
      });
    }

    // Handle web search rate limiting
    let actualWebSearch = webSearch;
    let rateLimitReached = false;

    if (webSearch) {
      try {
        const auth = await requireAuth(req as NextRequest);
        if (auth.isAuthenticated && auth.userId) {
          if (!consumeWebSearch(auth.userId)) {
            actualWebSearch = false;
            rateLimitReached = true;
          }
        } else {
          // If not authenticated, disable web search
          actualWebSearch = false;
        }
      } catch (error) {
        console.error("Error handling web search rate limiting:", error);
        // On error, disable web search to be safe
        actualWebSearch = false;
      }
    }

    const modelConfig = getModelConfig(model);
    const response = await fetch(
      `${modelConfig.nilAIInstance}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NILAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          stream: stream,
          web_search: actualWebSearch,
          temperature: modelConfig.temperature,
          max_tokens: modelConfig.maxTokens,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `API request failed: ${response.status} - ${response.statusText}: ${errorText}`,
      );
    }

    if (!stream) {
      const data = await response.json();

      // Add rate limit information to response
      if (rateLimitReached) {
        data.rate_limit_reached = true;
        data.rate_limit_message = `You have reached the daily limit of ${WEB_SEARCH_DAILY_LIMIT} web searches. Web search has been disabled for this request.`;
      }

      return NextResponse.json(data);
    }

    if (!response.body) {
      throw new Error("No response body for streaming");
    }

    const transformStream = new TransformStream({
      transform(chunk, controller) {
        controller.enqueue(chunk);
      },
    });

    response.body.pipeThrough(transformStream);

    const headers: Record<string, string> = {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    };

    // Add rate limit information as headers for streaming responses
    if (rateLimitReached) {
      headers["X-Rate-Limit-Reached"] = "true";
      headers["X-Rate-Limit-Message"] =
        `You have reached the daily limit of ${WEB_SEARCH_DAILY_LIMIT} web searches. Web search has been disabled for this request.`;
    }

    return new Response(transformStream.readable, {
      headers,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 },
    );
  }
}
