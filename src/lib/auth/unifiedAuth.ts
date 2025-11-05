// src/lib/auth/unifiedAuth.ts

import { PrivyClient, type User as PrivyUser } from "@privy-io/server-auth";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface UnifiedAuthResult {
  userId: string | null;
  authProvider: "supabase" | "privy" | null;
  isAuthenticated: boolean;
  error?: string;
  privyUser?: PrivyUser;
}

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const privyAppSecret = process.env.PRIVY_APP_SECRET;

if (!privyAppId || !privyAppSecret) {
  throw new Error("Missing Privy environment variables");
}

const privyClient = new PrivyClient(privyAppId, privyAppSecret);

export async function getUnifiedAuth(
  request: NextRequest,
  options: {
    requireAuth?: boolean;
    allowPrivyFallback?: boolean;
  } = {},
): Promise<UnifiedAuthResult> {
  const { requireAuth = true, allowPrivyFallback = true } = options;
  const accessToken = request.headers.get("authorization")?.split(" ")[1];

  try {
    const supabase = createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(accessToken);

    if (user && !authError) {
      return {
        userId: user.id,
        authProvider: "supabase",
        isAuthenticated: true,
      };
    }

    if (allowPrivyFallback) {
      const cookieHeader = request.headers.get("cookie");

      if (cookieHeader) {
        const cookies = cookieHeader.split(";").reduce(
          (acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value;
            return acc;
          },
          {} as Record<string, string>,
        );

        const idToken = cookies["privy-id-token"];

        if (idToken) {
          try {
            const privyUser = await privyClient.getUser({ idToken });

            if (privyUser?.id) {
              return {
                userId: privyUser.id,
                authProvider: "privy",
                isAuthenticated: true,
                privyUser,
              };
            }
          } catch (privyError) {
            console.error(privyError);
          }
        }
      }
    }

    const errorMessage = requireAuth
      ? "Authentication required - no valid Supabase session or Privy userId found"
      : "No authentication found";

    console.error("Authentication failed:", errorMessage);

    return {
      userId: null,
      authProvider: null,
      isAuthenticated: false,
      error: errorMessage,
    };
  } catch (error) {
    console.error("Authentication system error:", error);
    return {
      userId: null,
      authProvider: null,
      isAuthenticated: false,
      error: "Authentication system error",
    };
  }
}

/**
 * Simplified helper to get userId from either auth system
 */
export async function getUserId(
  request: NextRequest,
  options?: Record<string, unknown>,
): Promise<string | null> {
  const auth = await getUnifiedAuth(request, {
    requireAuth: false,
    allowPrivyFallback: true,
    ...options,
  });

  return auth.userId;
}

/**
 * Middleware helper for API routes that require authentication
 */
export async function requireAuth(
  request: NextRequest,
  options?: {
    autoCreateUser?: boolean;
  },
): Promise<UnifiedAuthResult> {
  const auth = await getUnifiedAuth(request, {
    requireAuth: true,
    allowPrivyFallback: true,
    ...options,
  });

  if (!auth.isAuthenticated) {
    throw new Error(auth.error || "Authentication required");
  }

  // Note: User creation is now handled by /api/createUser endpoint

  return auth;
}
