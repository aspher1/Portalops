# Decisions

1. **Next.js monolith for the MVP.** It provides a fast path to a polished control plane and server boundary. Execution remains behind an adapter so workers can separate later.
2. **Deterministic workflow state over unconstrained agent loops.** Steps and budgets are persisted concepts; AI may propose semantic locators or summarize evidence, but cannot redefine policy.
3. **Approval is step-scoped.** Authorization applies to one expected diff and state, preventing a broad “continue” grant.
4. **PostgreSQL and row-level security.** Relational constraints fit workflow lineage and approval consistency. Explicit tenant predicates plus RLS provide defense in depth.
5. **Synthetic payer portals in the same app.** They make product behavior demonstrable without credentials, real provider data, or third-party side effects.
6. **No fabricated persistence.** The interactive prototype updates local UI state, and the API clearly says it does not persist. The SQL migration expresses the target durable model.
7. **No compliance claims.** Controls and gaps are documented independently from legal or certification language.
