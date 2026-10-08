// api/deleteAccount/route.ts
import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { v5 as uuidv5 } from "uuid";
import { requireAuth } from "@/lib/auth/unifiedAuth";
import { deleteRecord } from "@/lib/nildb/deleteRecord";
import { setupClient } from "@/lib/nildb/setupClient";
import { isNilDBAvailable } from "@/lib/nildb/status";

type TDeletionResults = Record<
  "user" | "chats" | "messages",
  { deleted: boolean; error: string | null }
>;

/**
 * Best-effort removal of the user's nilDB records. Never throws, so the
 * auth provider account is still deleted when nilDB is unavailable.
 */
async function deleteNilDBRecords(
  userId: string,
  authProvider: "supabase" | "privy",
): Promise<TDeletionResults> {
  const deletionResults: TDeletionResults = {
    user: { deleted: false, error: null },
    chats: { deleted: false, error: null },
    messages: { deleted: false, error: null },
  };

  if (!(await isNilDBAvailable())) {
    const error = "nilDB unavailable";
    deletionResults.user.error = error;
    deletionResults.chats.error = error;
    deletionResults.messages.error = error;
    return deletionResults;
  }

  // Calculate recordId for nilDB user collection (same logic as createUser)
  const namespace = process.env.SALT;
  const recordId =
    authProvider === "supabase"
      ? userId
      : namespace
        ? uuidv5(userId, namespace)
        : null;

  let builder: Awaited<ReturnType<typeof setupClient>>;
  try {
    builder = await setupClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error connecting to nilDB:", error);
    deletionResults.user.error = message;
    deletionResults.chats.error = message;
    deletionResults.messages.error = message;
    return deletionResults;
  }

  // Delete user record
  if (recordId) {
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
  } else {
    deletionResults.user.error = "SALT environment variable is not set";
  }

  // Delete chats (using creator field with original user_id)
  try {
    await deleteRecord(builder, process.env.CHATS_COLLECTION_ID, {
      creator: userId,
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
      creator: userId,
    });
    deletionResults.messages.deleted = true;
  } catch (error) {
    deletionResults.messages.error =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error deleting messages from nilDB:", error);
  }

  return deletionResults;
}

const describeNilDBResults = (results: TDeletionResults) =>
  Object.values(results).every((result) => result.deleted)
    ? "and nilDB"
    : "(nilDB records could not all be deleted)";

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (!auth.isAuthenticated || !auth.userId || !auth.authProvider) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const deletionResults = await deleteNilDBRecords(
      auth.userId,
      auth.authProvider,
    );

    // Delete from Supabase
    if (auth.authProvider === "supabase") {
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

      const { error } = await supabaseAdmin.auth.admin.deleteUser(auth.userId);

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
        message: `User deleted from Supabase ${describeNilDBResults(deletionResults)}`,
        provider: "supabase",
        nilDBResults: deletionResults,
      });
    }

    // Delete from Privy
    if (auth.authProvider === "privy") {
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
          `https://api.privy.io/v1/users/${auth.userId}`,
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
          message: `User deleted from Privy ${describeNilDBResults(deletionResults)}`,
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
