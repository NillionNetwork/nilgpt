// api/getChatMessages/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/unifiedAuth";
import { getRecord } from "@/lib/nildb/getRecord";
import { setupClient } from "@/lib/nildb/setupClient";
import { isNilDBAvailable } from "@/lib/nildb/status";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const auth = await requireAuth(request);

    if (!(await isNilDBAvailable())) {
      return NextResponse.json({ error: "nilDB unavailable" }, { status: 503 });
    }

    const filter = { chat_id: params.id, creator: auth.userId };

    const builder = await setupClient();
    const dataWritten = await getRecord(
      builder,
      process.env.MESSAGES_COLLECTION_ID,
      filter,
    );

    const messages = dataWritten?.result || dataWritten;

    const sortedMessages = Array.isArray(messages)
      ? messages.sort((a, b) => {
          const orderA = Number(a.order ?? 0);
          const orderB = Number(b.order ?? 0);
          return orderA - orderB;
        })
      : messages;

    return NextResponse.json({
      success: true,
      message: "GETCHATMESSAGES via SecretVaults",
      content: sortedMessages,
    });
  } catch (error) {
    console.error("getChats error:", error);
    return NextResponse.json(
      { error: "Failed to process getChatMessages request" },
      { status: 500 },
    );
  }
}
