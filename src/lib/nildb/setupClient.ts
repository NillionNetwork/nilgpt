import { NilauthClient } from "@nillion/nilauth-client";
import { Signer } from "@nillion/nuc";
import { SecretVaultBuilderClient } from "@nillion/secretvaults";

const config = {
  NILAUTH_URL: process.env.NILAUTH_URL,
  NILDB_NODES: process.env.NILDB_NODES?.split(","),
  NILLION_API_KEY: process.env.NILLION_API_KEY,
};

// Global client instance - created once at startup
let globalClient: SecretVaultBuilderClient | null = null;

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

  if (!config.NILAUTH_URL || !config.NILDB_NODES) {
    console.error("Please set NILAUTH_URL, and NILDB_NODES in your .env file");
    process.exit(1);
  }

  const isTestnet = config.NILAUTH_URL.includes("staging");

  const nilauthClient = await NilauthClient.create({
    baseUrl: config.NILAUTH_URL,
    chainId: isTestnet ? 11155111 : 1,
  });

  globalClient = await SecretVaultBuilderClient.from({
    signer,
    dbs: config.NILDB_NODES,
    nilauthClient,
    blindfold: {
      operation: "store",
    },
  });

  await globalClient.refreshRootToken();
  console.log("nildb client initialized successfully");
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

  // Refresh the token before each operation (tokens expire in 1 minute)
  await globalClient.refreshRootToken();

  return globalClient;
}
