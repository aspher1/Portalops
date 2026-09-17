import "server-only";
import { z } from "zod";

const contextSchema = z.object({
  tenantId: z.string().regex(/^tenant_[a-z0-9_]+$/),
  actorId: z.string().regex(/^user_[a-z0-9_]+$/),
  role: z.enum(["operator", "approver", "admin"]),
});

export type RequestContext = z.infer<typeof contextSchema>;

/**
 * Demo auth adapter. A production deployment must replace these trusted proxy
 * headers with verified session claims. It intentionally fails closed.
 */
export function requestContext(headers: Headers): RequestContext | null {
  return contextSchema.safeParse({
    tenantId: headers.get("x-portalops-tenant"),
    actorId: headers.get("x-portalops-actor"),
    role: headers.get("x-portalops-role"),
  }).data ?? null;
}

export function canApprove(context: RequestContext) {
  return context.role === "approver" || context.role === "admin";
}
