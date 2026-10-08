const PING_TIMEOUT_MS = 3000;
const CACHE_TTL_MS = 30_000;

let cached: { available: boolean; checkedAt: number } | null = null;

/**
 * Check whether every configured nilDB node is reachable.
 * All nodes are required because secret-shared fields need every share to
 * be reconstructed. Set NILDB_DISABLED=true to skip nilDB entirely.
 */
export async function isNilDBAvailable(): Promise<boolean> {
  if (process.env.NILDB_DISABLED === "true") {
    return false;
  }

  const nodes = process.env.NILDB_NODES?.split(",").filter(Boolean);
  if (!nodes?.length || !process.env.NILLION_API_KEY) {
    return false;
  }

  if (cached && Date.now() - cached.checkedAt < CACHE_TTL_MS) {
    return cached.available;
  }

  const results = await Promise.all(
    nodes.map(async (node) => {
      try {
        const response = await fetch(`${node}/about`, {
          signal: AbortSignal.timeout(PING_TIMEOUT_MS),
          cache: "no-store",
        });
        return response.ok;
      } catch {
        return false;
      }
    }),
  );

  const available = results.every(Boolean);
  cached = { available, checkedAt: Date.now() };
  return available;
}
