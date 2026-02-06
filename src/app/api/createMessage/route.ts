// api/createMessage/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "@/lib/auth/unifiedAuth";
import { setupClient } from "@/lib/nildb/setupClient";
import { writeRecord } from "@/lib/nildb/writeRecord";
import type { MESSAGES_SCHEMA } from "@/types/schemas";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    const body = await request.json();
    const {
      chat_id,
      role,
      order,
      timestamp,
      model,
      blindfoldContent,
      attachments,
      pwa,
      sources,
      web_search,
    } = body;

    if (!chat_id || !role || !blindfoldContent || order === undefined) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: chat_id, role, blindfoldContent, order",
        },
        { status: 400 },
      );
    }

    if (role !== "user" && role !== "assistant") {
      return NextResponse.json(
        { error: 'Role must be either "user" or "assistant"' },
        { status: 400 },
      );
    }

    const messageData: MESSAGES_SCHEMA = {
      _id: uuidv4(),
      chat_id: chat_id,
      creator: auth.userId as string,
      role: role,
      content: { "%allot": blindfoldContent },
      order: order,
      timestamp: timestamp,
      model: model,
      signature: "",
      ...(pwa === true && { pwa: true }),
      ...(attachments?.length > 0 && { attachments }),
      ...(sources?.length > 0 && { sources }),
      ...(web_search === true && { web_search: true }),
    };

    const builder = await setupClient();

    await writeRecord(builder, process.env.MESSAGES_COLLECTION_ID, messageData);

    return NextResponse.json({
      success: true,
      message: "Message created successfully",
    });
  } catch (error) {
    console.error("createMessage error:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 },
    );
  }
}
