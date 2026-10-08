//api/updateChat/route.ts
// Kept for the mobile app, which still stores chats in nilDB. Returns 503
// once nilDB is unavailable; the web app stores chats on the device.
import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/unifiedAuth";
import { setupClient } from "@/lib/nildb/setupClient";
import { isNilDBAvailable } from "@/lib/nildb/status";
import { updateRecord } from "@/lib/nildb/updateRecord";
import type { CHAT_SCHEMA } from "@/types/schemas";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    if (!(await isNilDBAvailable())) {
      return NextResponse.json({ error: "nilDB unavailable" }, { status: 503 });
    }

    const body = await request.json();
    const { _id, title, message_count, noTitle } = body;

    if (!_id) {
      return NextResponse.json(
        {
          error: "Missing _id",
        },
        { status: 400 },
      );
    }

    const updateData: Partial<CHAT_SCHEMA> = {
      creator: auth.userId as string,
      updated_at: new Date().toISOString(),
      ...(message_count !== undefined && { message_count }),
    };

    if (!noTitle && title !== undefined) {
      updateData.title = { "%allot": title };
    }

    // Only allow updating the caller's own chats
    const filter = { _id: _id, creator: auth.userId };

    const builder = await setupClient();
    await updateRecord(
      builder,
      process.env.CHATS_COLLECTION_ID,
      filter,
      updateData,
    );

    return NextResponse.json({
      success: true,
      message: "UPDATED CHATS via SecretVaults",
    });
  } catch (error) {
    console.error("updateChat error:", error);
    return NextResponse.json(
      { error: "Failed to process updateChat request" },
      { status: 500 },
    );
  }
}
