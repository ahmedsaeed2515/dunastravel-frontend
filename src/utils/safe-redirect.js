/**
 * Open Redirect Defense Utility
 * Validates redirect URLs to prevent open redirect vulnerabilities.
 */
export function getSafeRedirectUrl(url, fallback = '/dashboard') {
  if (!url || typeof url !== 'string') {
    return fallback;
  }

  // Remove whitespace
  const trimmed = url.trim();

  // Reject control characters like \r, \n, etc.
  // eslint-disable-next-line no-control-regex
  if (/[\r\n\0-\x1F]/.test(trimmed)) {
    return fallback;
  }

  // Reject absolute URLs with protocols (e.g., http://, https://, javascript:, data:)
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return fallback;
  }

  // Reject protocol-relative URLs (//) or backslash tricks (/\, \\)
  if (/^(\/\/|\\|\/\\)/.test(trimmed)) {
    return fallback;
  }

  // Reject paths containing javascript: or other pseudo-protocols even if prefixed by slash
  if (/^\/[a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return fallback;
  }

  // Ensure it starts with a single slash '/'
  if (!trimmed.startsWith('/')) {
    return fallback;
  }

  return trimmed;
}
