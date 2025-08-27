import { NextResponse } from "next/server";
import { DEFAULT_MODEL, getPersonaPrompt } from "@/config/personas";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const model = body.model || DEFAULT_MODEL;
    const persona = body.persona || "companion";
    const stream = body.stream !== false;

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

    const response = await fetch(
      `${process.env.NILAI_API2_URL}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NILAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.2,
          stream: stream,
          max_tokens: 1100,
          web_search: false,
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

    return new Response(transformStream.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 },
    );
  }
}
