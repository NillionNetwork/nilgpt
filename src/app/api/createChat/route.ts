//api/createChat/route.ts
// Kept for the mobile app, which still stores chats in nilDB. Returns 503
// once nilDB is unavailable; the web app stores chats on the device.
import { type NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "@/lib/auth/unifiedAuth";
import { setupClient } from "@/lib/nildb/setupClient";
import { isNilDBAvailable } from "@/lib/nildb/status";
import { writeRecord } from "@/lib/nildb/writeRecord";
import type { CHAT_SCHEMA } from "@/types/schemas";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    if (!(await isNilDBAvailable())) {
      return NextResponse.json({ error: "nilDB unavailable" }, { status: 503 });
    }

    const body = await request.json();
    const { _id, title, message_count, persona } = body;

    const currentTime = new Date().toISOString();
    const newUUID = _id || uuidv4();

    const chatData: CHAT_SCHEMA = {
      _id: newUUID,
      creator: auth.userId as string,
      title: { "%allot": title },
      created_at: currentTime,
      updated_at: currentTime,
      message_count,
      persona: persona,
    };

    const builder = await setupClient();
    await writeRecord(builder, process.env.CHATS_COLLECTION_ID, chatData);

    return NextResponse.json({
      success: true,
      message: newUUID,
    });
  } catch (error) {
    console.error("createChat error:", error);
    return NextResponse.json(
      { error: "Failed to process createChat request" },
      { status: 500 },
    );
  }
}
