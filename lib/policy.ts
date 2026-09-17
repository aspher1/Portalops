import { z } from "zod";
import { isIP } from "node:net";

const hostSchema = z.string().min(1).transform((host) => host.toLowerCase().replace(/\.$/, ""));

export type NavigationDecision =
  | { allowed: true; host: string }
  | {
      allowed: false;
      reason:
        | "invalid_url"
        | "unsupported_protocol"
        | "embedded_credentials"
        | "nonstandard_port"
        | "ip_literal_blocked"
        | "local_host_blocked"
        | "domain_not_allowed";
    };

export function evaluateNavigation(rawUrl: string, allowedDomains: readonly string[]): NavigationDecision {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return { allowed: false, reason: "invalid_url" };
  }
  if (url.protocol !== "https:" && !(url.protocol === "http:" && url.hostname === "localhost")) {
    return { allowed: false, reason: "unsupported_protocol" };
  }
  if (url.username || url.password) {
    return { allowed: false, reason: "embedded_credentials" };
  }
  if (url.port && !((url.protocol === "https:" && url.port === "443") || (url.protocol === "http:" && url.port === "80"))) {
    return { allowed: false, reason: "nonstandard_port" };
  }
  const host = hostSchema.parse(url.hostname);
  if (isIP(host)) {
    return { allowed: false, reason: "ip_literal_blocked" };
  }
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) {
    return { allowed: false, reason: "local_host_blocked" };
  }
  const allowed = allowedDomains.some((entry) => {
    const wildcard = entry.startsWith("*.");
    const domain = hostSchema.parse(wildcard ? entry.slice(2) : entry);
    return wildcard ? host.endsWith(`.${domain}`) && host !== domain : host === domain;
  });
  return allowed ? { allowed: true, host } : { allowed: false, reason: "domain_not_allowed" };
}

const suspiciousPatterns = [
  /ignore (?:all |any |the |previous )*(?:previous )?(instructions|rules)/i,
  /system (message|prompt)/i,
  /reveal (credentials|secrets|tokens|passwords)/i,
  /upload .{0,20} to/i,
  /disable .{0,20}(safety|policy|approval)/i,
];

export function inspectPortalText(text: string) {
  const pattern = suspiciousPatterns.find((candidate) => candidate.test(text));
  return pattern
    ? { safe: false as const, reason: "potential_prompt_injection", matched: pattern.source }
    : { safe: true as const };
}

export function requiresApproval(kind: string, destructive: boolean) {
  return destructive || ["submit", "delete", "attest", "payment"].includes(kind);
}
