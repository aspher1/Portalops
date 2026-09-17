# PortalOps AI

PortalOps AI is a supervised operations workspace for healthcare provider credentialing and payer enrollment teams. It demonstrates bounded browser workflows, human approval before external side effects, and evidence-backed run histories.

> This repository is an MVP using only synthetic organizations, providers, identifiers, and payer portals. It is not a compliance-certified system and makes no HIPAA, SOC 2, accuracy, or automation-success claims.

## What is included

- Polished responsive app with Dashboard, Workflows, Runs, Approvals, Agents, Evidence, Integrations, and Settings
- Flagship enrollment status-check and address-update approval experiences
- Synthetic Atlas Health Plan and Meridian Choice payer portals at `/portals/atlas` and `/portals/meridian`
- Typed workflow/run/step/approval/evidence contracts and a bounded deterministic executor
- Domain allowlisting, untrusted-content inspection, side-effect approval policy, and tenant-aware server boundary
- PostgreSQL migration with relational constraints, tenant keys, indexes, RLS policies, immutable evidence digests, and idempotency keys
- Unit tests for navigation policy, injection detection, approval gating, retry budgets, and semantic recovery

## Run locally

Requires Node 22+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). All displayed data is synthetic. The dashboard demo is interactive but in-memory; its decision API deliberately validates without persisting.

## Verify

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

## Documentation

- [Product](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Security](docs/SECURITY.md)
- [Decisions](docs/DECISIONS.md)
- [Assumptions](docs/ASSUMPTIONS.md)
- [Roadmap](docs/ROADMAP.md)
- [Build log](docs/BUILD_LOG.md)

## Status

This is a commercially credible product prototype and architecture seed, not production software. Authentication headers, durable job orchestration, encrypted object storage, secrets management, and real payer connectors must be implemented and independently assessed before handling real data.
