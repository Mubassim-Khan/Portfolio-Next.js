export function isSessionValid(sessionStr: string | undefined): boolean {
  if (!sessionStr) return false;
  try {
    const session = JSON.parse(sessionStr);
    const now = Date.now();
    const SESSION_DURATION = 12 * 60 * 60 * 1000; // 12 hours
    const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 mins

    if (process.env.NODE_ENV === "development") {
      return now - session.createdAt <= SESSION_DURATION;
    }

    return (
      now - session.createdAt <= SESSION_DURATION &&
      now - session.lastActive <= INACTIVITY_LIMIT
    );
  } catch {
    return false;
  }
}
