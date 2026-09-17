import { NextResponse } from "next/server";
import { z } from "zod";
import { approvals } from "@/lib/demo-data";
import { canApprove, requestContext } from "@/lib/server/auth";

const decisionSchema = z.object({
  decision: z.enum(["approved", "rejected", "human_takeover"]),
  expectedStatus: z.literal("pending"),
  reason: z.string().trim().min(3).max(500),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // This scaffold has no verified session provider. Keep the header-based
  // adapter unreachable in hosted builds so it cannot be mistaken for auth.
  if (process.env.NODE_ENV !== "development" || process.env.PORTALOPS_ENABLE_LOCAL_DEMO_API !== "true") {
    return NextResponse.json({ error: "demo_api_disabled" }, { status: 503 });
  }
  const context = requestContext(request.headers);
  if (!context) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  if (!canApprove(context)) return NextResponse.json({ error: "insufficient_role" }, { status: 403 });
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") {
    return NextResponse.json({ error: "content_type_required" }, { status: 415 });
  }

  const parsed = decisionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_decision" }, { status: 400 });

  const { id } = await params;
  const approval = approvals.find((item) => item.id === id && item.tenantId === context.tenantId);
  // Same response prevents cross-tenant resource enumeration.
  if (!approval) return NextResponse.json({ error: "approval_not_found" }, { status: 404 });
  if (approval.status !== parsed.data.expectedStatus) {
    return NextResponse.json({ error: "approval_already_decided" }, { status: 409 });
  }

  return NextResponse.json({
    id,
    decision: parsed.data.decision,
    decidedBy: context.actorId,
    auditEvent: `approval.${parsed.data.decision}`,
    note: "Demo API validates the boundary but does not persist mutations.",
  });
}
