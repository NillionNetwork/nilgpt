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

export async function updateRecord(
  builder: SecretVaultBuilderClient | null,
  collectionId: string | undefined,
  filter: Record<string, unknown>,
  updatedData: Record<string, unknown>,
  operator: string = "$set",
): Promise<{ status: string; message: string }> {
  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  // Determine which client to use based on whether updatedData contains %allot
  const hasSecrets = containsAllot(updatedData);
  const client = hasSecrets
    ? builder || (await setupClient())
    : await setupClientNoBlindfold();

  await client.updateData({
    collection: collectionId,
    filter: filter,
    update: {
      [operator]: updatedData,
    },
  });

  return {
    status: "success",
    message: "Updated record successfully",
  };
}
