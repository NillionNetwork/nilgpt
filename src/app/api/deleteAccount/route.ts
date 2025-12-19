// api/deleteAccount/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v5 as uuidv5 } from "uuid";
import { deleteRecord } from "@/lib/nildb/deleteRecord";
import { setupClient } from "@/lib/nildb/setupClient";

// Helper function to check if a string is a UUID
function isUUID(str: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Helper function to check if a string is a Privy DID
function isPrivyDID(str: string): boolean {
  return str.startsWith("did:privy:");
}

export async function DELETE(request: NextRequest) {
  try {
    const { user_id } = await request.json();

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: "user_id is required" },
        { status: 400 },
      );
    }

    // Determine provider based on user_id format
    let provider: "supabase" | "privy" | null = null;

    if (isUUID(user_id)) {
      provider = "supabase";
    } else if (isPrivyDID(user_id)) {
      provider = "privy";
    } else {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid user_id format. Must be UUID (Supabase) or did:privy:... (Privy)",
        },
        { status: 400 },
      );
    }

    // Calculate recordId for nilDB user collection (same logic as createUser)
    const namespace = process.env.SALT;
    if (!namespace) {
      return NextResponse.json(
        {
          success: false,
          error: "SALT environment variable is not set",
        },
        { status: 500 },
      );
    }

    let recordId: string;
    if (provider === "supabase") {
      recordId = user_id;
    } else {
      recordId = uuidv5(user_id, namespace);
    }

    // Delete from nilDB collections
    const builder = await setupClient();
    const deletionResults = {
      user: { deleted: false, error: null as string | null },
      chats: { deleted: false, error: null as string | null },
      messages: { deleted: false, error: null as string | null },
    };

    // Delete user record
    try {
      await deleteRecord(builder, process.env.USER_COLLECTION_ID, {
        _id: recordId,
      });
      deletionResults.user.deleted = true;
    } catch (error) {
      deletionResults.user.error =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error deleting user from nilDB:", error);
    }

    // Delete chats (using creator field with original user_id)
    try {
      await deleteRecord(builder, process.env.CHATS_COLLECTION_ID, {
        creator: user_id,
      });
      deletionResults.chats.deleted = true;
    } catch (error) {
      deletionResults.chats.error =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error deleting chats from nilDB:", error);
    }

    // Delete messages (using creator field with original user_id)
    try {
      await deleteRecord(builder, process.env.MESSAGES_COLLECTION_ID, {
        creator: user_id,
      });
      deletionResults.messages.deleted = true;
    } catch (error) {
      deletionResults.messages.error =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error deleting messages from nilDB:", error);
    }

    // Delete from Supabase
    if (provider === "supabase") {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseServiceRoleKey) {
        return NextResponse.json(
          {
            success: false,
            error: "Supabase configuration missing",
            nilDBResults: deletionResults,
          },
          { status: 500 },
        );
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id);

      if (error) {
        console.error("Supabase delete user error:", error);
        return NextResponse.json(
          {
            success: false,
            error: `Failed to delete user from Supabase: ${error.message}`,
            nilDBResults: deletionResults,
          },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        message: "User deleted from Supabase and nilDB successfully",
        provider: "supabase",
        nilDBResults: deletionResults,
      });
    }

    // Delete from Privy
    if (provider === "privy") {
      const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
      const privyAppSecret = process.env.PRIVY_APP_SECRET;

      if (!privyAppId || !privyAppSecret) {
        return NextResponse.json(
          {
            success: false,
            error: "Privy configuration missing",
            nilDBResults: deletionResults,
          },
          { status: 500 },
        );
      }

      // Use Privy REST API to delete user
      const authHeader = Buffer.from(
        `${privyAppId}:${privyAppSecret}`,
      ).toString("base64");

      try {
        const response = await fetch(
          `https://api.privy.io/v1/users/${user_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Basic ${authHeader}`,
              "privy-app-id": privyAppId,
            },
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Privy delete user error:", response.status, errorText);
          return NextResponse.json(
            {
              success: false,
              error: `Failed to delete user from Privy: ${response.statusText}`,
              nilDBResults: deletionResults,
            },
            { status: response.status },
          );
        }

        return NextResponse.json({
          success: true,
          message: "User deleted from Privy and nilDB successfully",
          provider: "privy",
          nilDBResults: deletionResults,
        });
      } catch (error) {
        console.error("Privy delete user error:", error);
        return NextResponse.json(
          {
            success: false,
            error: `Failed to delete user from Privy: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
            nilDBResults: deletionResults,
          },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unknown provider",
      },
      { status: 500 },
    );
  } catch (error) {
    console.error("deleteAccount error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process deleteAccount request",
      },
      { status: 500 },
    );
  }
}
