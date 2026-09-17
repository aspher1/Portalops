# Architecture

## Shape

PortalOps is a Next.js application organized around a tenant-scoped control plane and a replaceable browser execution plane.

1. A versioned workflow defines typed inputs, ordered steps, retry budgets, domain scope, and side-effect policy.
2. A run snapshots that definition and advances one durable step at a time.
3. Read operations may complete automatically. Every submit, delete, attestation, payment, or explicitly destructive action creates an approval and stops.
4. Approval authorizes one proposed step and expected state, not an open-ended agent session.
5. Each step emits append-only events and content-addressed evidence.

`lib/execution.ts` is the deterministic orchestration seam. `BrowserAdapter` is intentionally narrow so Playwright, a remote browser service, or a test double can implement it without leaking page objects into workflow logic. Semantic recovery re-reads visible labels/landmarks after locator drift, within a hard attempt budget.

## Data

`db/migrations/0001_initial.sql` is PostgreSQL compatible and models tenants, users, workflows, runs, run steps, approvals, evidence, and audit events. Tenant IDs are mandatory, common access indexes begin with tenant ID, and RLS is enabled. Run idempotency keys and one-pending-approval-per-step prevent duplicate effects.

In production, every transaction must execute after setting `app.tenant_id` from verified identity claims. Application predicates remain required defense in depth.

## Server boundary

Routes parse inputs with Zod, derive tenant and role from server-trusted identity, query by both resource and tenant, and use non-enumerating not-found responses. The included demo adapter reads trusted-proxy headers only to make the contract explicit; it is not production authentication.

## Evidence

Evidence records reference immutable object keys and SHA-256 digests. A production worker should capture before/after screenshots, redacted DOM facts, action inputs, and portal confirmation, then seal a manifest. Binary artifacts belong in encrypted object storage; metadata belongs in PostgreSQL.

## Intended production topology

- Next.js control plane behind verified SSO/session middleware
- PostgreSQL with a restricted, non-owner runtime role and enforced RLS
- Durable queue/state machine with per-tenant concurrency and idempotent leases
- Isolated Playwright workers with ephemeral contexts and egress allowlists
- Encrypted artifact storage and KMS-backed connector secrets
- Signed webhooks and centralized audit/observability pipeline
