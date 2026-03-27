import { Signer } from "@nillion/nuc";
import { SecretVaultBuilderClient } from "@nillion/secretvaults";

const config = {
  NILDB_NODES: process.env.NILDB_NODES?.split(","),
  NILLION_API_KEY: process.env.NILLION_API_KEY,
};

// Global client instance - created once at startup
let globalClient: SecretVaultBuilderClient | null = null;
// Alternate client without blindfold for non-secret data
let globalClientNoBlindfold: SecretVaultBuilderClient | null = null;

/**
 * Initialize the global nildb client once at startup
 * This should be called when the application starts
 */
export async function initializeClient(): Promise<void> {
  if (globalClient) {
    return; // Already initialized
  }

  if (!config.NILLION_API_KEY) {
    console.error("Please set NILLION_API_KEY in your .env file");
    process.exit(1);
  }

  const signer = Signer.fromPrivateKey(config.NILLION_API_KEY);

  if (!config.NILDB_NODES) {
    console.error("Please set NILDB_NODES in your .env file");
    process.exit(1);
  }

  globalClient = await SecretVaultBuilderClient.from({
    signer,
    dbs: config.NILDB_NODES,
    blindfold: {
      operation: "store",
    },
  });

  // Initialize alternate client without blindfold
  globalClientNoBlindfold = await SecretVaultBuilderClient.from({
    signer,
    dbs: config.NILDB_NODES,
  });
}

/**
 * Get the client and refresh the token
 * This should be called before each nildb operation
 */
export async function setupClient(): Promise<SecretVaultBuilderClient> {
  // Ensure client is initialized (will initialize on first call if needed)
  if (!globalClient) {
    await initializeClient();
  }

  if (!globalClient) {
    throw new Error("Failed to initialize nildb client");
  }

  return globalClient;
}

/**
 * Get the client without blindfold and refresh the token
 * This should be called for operations that don't involve secrets
 */
export async function setupClientNoBlindfold(): Promise<SecretVaultBuilderClient> {
  // Ensure client is initialized (will initialize on first call if needed)
  if (!globalClientNoBlindfold) {
    await initializeClient();
  }

  if (!globalClientNoBlindfold) {
    throw new Error("Failed to initialize nildb client (no blindfold)");
  }

  return globalClientNoBlindfold;
}
