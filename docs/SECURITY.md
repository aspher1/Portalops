# Security

This MVP demonstrates controls; it is not compliance-certified and must not process real protected health information.

## Implemented

- Synthetic-only UI and payer portals are visibly labeled.
- Navigation policy accepts HTTPS (plus localhost for development), exact domains, and true subdomains; suffix-confusion hosts are rejected.
- Portal text is untrusted. Common prompt-injection instructions block the step instead of changing agent policy.
- Submit/destructive actions require explicit approval before the adapter is called.
- Execution attempts are bounded; recovery cannot recurse indefinitely.
- API input is schema-validated and approval role is checked.
- Resource lookup includes tenant ID and returns a uniform not-found response across tenants.
- PostgreSQL schema carries tenant ID on operational records and includes RLS policies.
- Evidence records require SHA-256 digests; runs support idempotency keys.
- Basic anti-framing, MIME-sniffing, referrer, and browser-permission headers are set.

## Required before production

- Replace trusted demo headers with verified sessions, CSRF protection, MFA/SSO, and lifecycle-managed RBAC.
- Use a PostgreSQL non-owner role, test RLS continuously, and set tenant context transaction-locally.
- Store portal secrets in a KMS-backed vault; never expose them to model context or logs.
- Isolate browser workers per run with outbound network enforcement, download quarantine, resource limits, and ephemeral profiles.
- Encrypt and redact artifacts, define retention/deletion, and audit every read.
- Add dependency, SAST, DAST, penetration, incident-response, backup, and recovery programs.
- Review legal/contractual permission for each payer portal and automation use case.

## Threat boundaries

Payer pages, downloaded files, OCR, and model output are attacker-controlled. None may alter system policy, allowed domains, approval requirements, credentials, or workflow budgets. An approval is bound to a tenant, run, step, expected pending state, and proposed diff to prevent confused-deputy and stale-approval behavior.

Report security issues privately to the repository owner; do not include sensitive data in an issue.
