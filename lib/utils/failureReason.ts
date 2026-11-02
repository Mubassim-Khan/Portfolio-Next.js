const HTTP_STATUS_TEXT: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  408: "Request Timeout",
  410: "Gone",
  429: "Too Many Requests",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

const NETWORK_ERRORS: Record<string, string> = {
  ENOTFOUND: "DNS lookup failed (domain not found)",
  EAI_AGAIN: "DNS lookup failed (temporary)",
  ECONNREFUSED: "Connection refused",
  ECONNRESET: "Connection reset by server",
  ETIMEDOUT: "Connection timed out",
  UND_ERR_CONNECT_TIMEOUT: "Connection timed out",
  CERT_HAS_EXPIRED: "SSL certificate expired",
  DEPTH_ZERO_SELF_SIGNED_CERT: "SSL certificate error (self-signed)",
  UNABLE_TO_VERIFY_LEAF_SIGNATURE: "SSL certificate error",
};

/** Human readable reason for an HTTP status code, e.g. "HTTP 404 Not Found". */
export function describeHttpStatus(status: number): string {
  const text = HTTP_STATUS_TEXT[status];
  return text ? `HTTP ${status} ${text}` : `HTTP ${status}`;
}

/** Human readable reason for a thrown fetch error (timeouts, DNS, TLS, ...). */
export function describeFetchError(error: unknown, timeoutMs: number): string {
  if (!(error instanceof Error)) return "Unknown error";
  if (error.name === "AbortError") return `Request timed out (${timeoutMs / 1000}s)`;
  const code = (error as Error & { cause?: { code?: string } }).cause?.code;
  if (code && NETWORK_ERRORS[code]) return NETWORK_ERRORS[code];
  return error.message === "fetch failed" && code ? `Network error (${code})` : error.message;
}

/** Best-effort reason for a stored uptime log (older logs only stored the status code). */
export function failureReason(httpStatus?: number | null, errorMessage?: string | null): string {
  if (errorMessage) return errorMessage;
  if (httpStatus) return describeHttpStatus(httpStatus);
  return "Unknown error";
}
