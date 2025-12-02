//api/createUser/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { v5 as uuidv5 } from "uuid";
import { requireAuth } from "@/lib/auth/unifiedAuth";
import { getRecord } from "@/lib/nildb/getRecord";
import { setupClient } from "@/lib/nildb/setupClient";
import { writeRecord } from "@/lib/nildb/writeRecord";
import type { USER_SCHEMA } from "@/types/schemas";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);

    if (!auth.isAuthenticated || !auth.userId || !auth.authProvider) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }

    const namespace = process.env.SALT;

    if (!namespace) {
      throw new Error("SALT is not set");
    }

    let recordId: string;
    if (auth.authProvider === "supabase") {
      recordId = auth.userId;
    } else {
      recordId = uuidv5(auth.userId, namespace);
    }

    const builder = await setupClient();

    // Check if user already exists first
    try {
      const userResult = await getRecord(
        builder,
        process.env.USER_COLLECTION_ID,
        {
          _id: recordId,
        },
      );

      // Check if user was found
      if (userResult.result && userResult.result.length > 0) {
        // User exists - return their data including UTM
        const existingUser = userResult.result[0];
        return NextResponse.json({
          success: true,
          message: "User already exists",
          provider: auth.authProvider,
          userExists: true,
          user: existingUser,
        });
      }

      // User not found, proceed with creation
      console.log("User not found in nilDB, proceeding with creation");
    } catch (readError) {
      // Proceed with creation if an error occurs during the getRecord call
      console.error("Error checking if user exists:", readError);
    }

    // Create a predictable creation time rounded to the closest 5 minutes
    const now = new Date();
    const minutes = now.getMinutes();
    const roundedMinutes = Math.ceil(minutes / 5) * 5;
    const creationTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      roundedMinutes,
    );
    const creationTimeString = creationTime.toISOString();

    // Get UTM parameters from request body if provided
    let utmData: USER_SCHEMA["utm"];
    try {
      const body = await request.json();
      if (body.utm && Object.keys(body.utm).length > 0) {
        utmData = body.utm;
      }
    } catch (_error) {
      // If no body or invalid JSON, continue without UTM data
    }

    const userData: USER_SCHEMA = {
      _id: recordId,
      provider: auth.authProvider,
      created_at: creationTimeString,
      ...(utmData && { utm: utmData }),
    };

    await writeRecord(builder, process.env.USER_COLLECTION_ID, userData);

    return NextResponse.json({
      success: true,
      message: "User created via SecretVaults",
      provider: auth.authProvider,
      userExists: false,
    });
  } catch (error) {
    console.error("createUser error:", error);

    if (error instanceof Error && error.message.includes("Authentication")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to process createUser request" },
      { status: 500 },
    );
  }
}
