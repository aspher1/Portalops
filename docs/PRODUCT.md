# Product

PortalOps AI is for provider enrollment specialists who repeatedly sign in to payer portals, locate records, compare statuses, stage updates, and retain proof. The product is an operator cockpit: automation does the bounded navigation and transcription work; people retain authority over consequential actions.

## MVP journeys

### Enrollment status check

An operator starts a run for a synthetic provider and payer. The agent navigates an approved domain, locates the enrollment reference, extracts status and effective date, compares them to the prior snapshot, and captures evidence. A changed status appears in activity and the run history.

### Practice address update

The guided `/demo` run locates a synthetic profile, visibly recovers from a moved portal target within its attempt budget, and stages an address and effective date. It then stops before submission and explains the side-effect policy. The approver sees exact before/after values and can approve that one synthetic step, reject it safely, or take control. Every path ends in a structured result and in-memory evidence summary. The experience is deterministic and entirely client-side: it does not persist data, call a backend, or affect an external portal.

## Product principles

- Supervision is a core state, not an exception modal.
- Runs explain what happened in operational language.
- A workflow is predictable: explicit inputs, steps, budgets, and outcomes.
- Recovery is bounded and visible.
- Portal content is evidence, never authority.
- Claims are calibrated: time returned is a configured estimate, not guaranteed savings.

## Personas

- Operator: starts runs, resolves missing inputs, reviews outputs.
- Approver: accepts or rejects proposed external changes.
- Administrator: manages access, connectors, policy, and retention.
- Auditor: reads run history and evidence without execution access.
