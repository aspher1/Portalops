# Assumptions

- This run is a product and architecture MVP, not a production deployment.
- All names, NPIs, tax-ID fragments, enrollment references, addresses, statuses, and portals are fictional.
- Users have authorization from relevant organizations before automating any real portal.
- The displayed time-returned metric is illustrative and would be computed from customer-configured baselines.
- A production identity layer supplies verified tenant, actor, and role claims; request headers in the demo only define that adapter boundary.
- A production Playwright adapter runs outside the web process in an isolated worker.
- Human approval is mandatory for external writes unless a future policy is explicitly configured, reviewed, and scoped.
- Portal DOMs change, so semantic recovery is expected, observable, and bounded rather than treated as guaranteed.
