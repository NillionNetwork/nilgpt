import type { SecretVaultBuilderClient } from "@nillion/secretvaults";
import { setupClient, setupClientNoBlindfold } from "./setupClient";

/**
 * Recursively check if data contains %allot anywhere in the structure
 */
function containsAllot(data: unknown): boolean {
  if (data === null || data === undefined) {
    return false;
  }

  if (typeof data === "object") {
    if (Array.isArray(data)) {
      return data.some((item) => containsAllot(item));
    }

    // Check if object has %allot as a key
    if ("%allot" in data) {
      return true;
    }

    // Recursively check all values
    return Object.values(data).some((value) => containsAllot(value));
  }

  return false;
}

export async function writeRecord(
  builder: SecretVaultBuilderClient | null,
  collectionId: string | undefined,
  data: unknown,
): Promise<{ status: string; message: string; data: Record<string, unknown> }> {
  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  // Determine which client to use based on whether data contains %allot
  const hasSecrets = containsAllot(data);
  const client = hasSecrets
    ? builder || (await setupClient())
    : await setupClientNoBlindfold();

  await client.createStandardData({
    collection: collectionId,
    data: [data as Record<string, unknown>],
  });

  return {
    status: "success",
    message: "Record written successfully",
    data: data as Record<string, unknown>,
  };
}
