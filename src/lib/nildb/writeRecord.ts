import type { SecretVaultBuilderClient } from "@nillion/secretvaults";

export async function writeRecord(
  builder: SecretVaultBuilderClient,
  collectionId: string | undefined,
  data: unknown,
): Promise<{ status: string; message: string; data: Record<string, unknown> }> {
  if (!collectionId) {
    throw new Error("Collection ID is required");
  }

  await builder.createStandardData({
    collection: collectionId,
    data: [data as Record<string, unknown>],
  });

  return {
    status: "success",
    message: "Record written successfully",
    data: data as Record<string, unknown>,
  };
}
