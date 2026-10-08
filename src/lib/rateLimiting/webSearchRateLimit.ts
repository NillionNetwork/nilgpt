// Rate limit configuration
export const WEB_SEARCH_DAILY_LIMIT = 20;

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

// In-memory daily counters, keyed by user id. Counters reset when the server
// restarts and are per instance, which is acceptable for a single deployment.
let countersDate = getTodayDateString();
const counters = new Map<string, number>();

/**
 * Record a web search for the user if they are under the daily limit.
 * Returns false when the limit has been reached.
 */
export function consumeWebSearch(userId: string): boolean {
  const today = getTodayDateString();
  if (today !== countersDate) {
    countersDate = today;
    counters.clear();
  }

  const count = counters.get(userId) ?? 0;
  if (count >= WEB_SEARCH_DAILY_LIMIT) {
    return false;
  }

  counters.set(userId, count + 1);
  return true;
}
