// Kept for the mobile app, which still stores chats in nilDB. Returns 503
// once nilDB is unavailable; the web app stores chats on the device.
import { type NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/unifiedAuth";
import { deleteRecord } from "@/lib/nildb/deleteRecord";
import { setupClient } from "@/lib/nildb/setupClient";
import { isNilDBAvailable } from "@/lib/nildb/status";

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    if (!(await isNilDBAvailable())) {
      return NextResponse.json({ error: "nilDB unavailable" }, { status: 503 });
    }

    const { chatId } = await request.json();

    if (!chatId) {
      return NextResponse.json(
        { success: false, error: "Chat ID is required" },
        { status: 400 },
      );
    }

    const builder = await setupClient();
    const result = await deleteRecord(
      builder,
      process.env.CHATS_COLLECTION_ID,
      // Only allow deleting the caller's own chats
      { _id: chatId, creator: auth.userId },
    );

    return NextResponse.json({
      success: true,
      message: result.message,
      deletedCount: result.deletedCount,
      acknowledged: result.acknowledged,
    });
  } catch (error) {
    console.error("Failed to delete chat:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete chat" },
      { status: 500 },
    );
  }
}
