import { z } from "zod";

const hostSchema = z.string().min(1).transform((host) => host.toLowerCase().replace(/\.$/, ""));

export type NavigationDecision =
  | { allowed: true; host: string }
  | { allowed: false; reason: "invalid_url" | "unsupported_protocol" | "domain_not_allowed" };

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
  const host = hostSchema.parse(url.hostname);
  const allowed = allowedDomains.some((entry) => {
    const domain = hostSchema.parse(entry);
    return host === domain || host.endsWith(`.${domain}`);
  });
  return allowed ? { allowed: true, host } : { allowed: false, reason: "domain_not_allowed" };
}

const suspiciousPatterns = [
  /ignore (all|any|the|previous) (instructions|rules)/i,
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
