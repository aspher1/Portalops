import type { Approval, WorkflowRun } from "./domain";

export const runs: WorkflowRun[] = [
  {
    id: "RUN-2841", tenantId: "tenant_northstar", workflow: "Enrollment status check",
    payer: "Atlas Health Plan", provider: "Northstar Medical Group", status: "completed",
    startedAt: "Today, 9:42 AM", progress: 100,
    steps: [
      { id: "s1", label: "Open payer portal", kind: "navigate", status: "completed", destructive: false, attempts: 1 },
      { id: "s2", label: "Locate enrollment record", kind: "extract", status: "completed", destructive: false, attempts: 1 },
      { id: "s3", label: "Compare status to prior snapshot", kind: "compare", status: "completed", destructive: false, attempts: 1 },
      { id: "s4", label: "Capture evidence", kind: "evidence", status: "completed", destructive: false, attempts: 1 },
    ],
  },
  {
    id: "RUN-2840", tenantId: "tenant_northstar", workflow: "Practice address update",
    payer: "Meridian Choice", provider: "Northstar Medical Group", status: "needs_approval",
    startedAt: "Today, 9:18 AM", progress: 72,
    steps: [
      { id: "s1", label: "Open payer portal", kind: "navigate", status: "completed", destructive: false, attempts: 1 },
      { id: "s2", label: "Find provider profile", kind: "extract", status: "completed", destructive: false, attempts: 2 },
      { id: "s3", label: "Stage address changes", kind: "write", status: "completed", destructive: false, attempts: 1 },
      { id: "s4", label: "Approve submission", kind: "submit", status: "blocked", destructive: true, attempts: 0 },
      { id: "s5", label: "Capture confirmation", kind: "evidence", status: "pending", destructive: false, attempts: 0 },
    ],
  },
  {
    id: "RUN-2839", tenantId: "tenant_northstar", workflow: "Roster verification",
    payer: "Summit Federal", provider: "Lakeside Pediatrics", status: "running",
    startedAt: "Today, 8:57 AM", progress: 46, steps: [],
  },
  {
    id: "RUN-2838", tenantId: "tenant_northstar", workflow: "Enrollment status check",
    payer: "Meridian Choice", provider: "Lakeside Pediatrics", status: "completed",
    startedAt: "Yesterday, 4:31 PM", progress: 100, steps: [],
  },
];

export const approvals: Approval[] = [{
  id: "APR-119", tenantId: "tenant_northstar", runId: "RUN-2840",
  title: "Submit practice address update", summary: "PortalOps staged two profile changes and paused before external submission.",
  requestedBy: "Atlas agent", createdAt: "24 min ago", risk: "medium", status: "pending",
  changes: [
    { field: "Practice address", before: "245 West Arbor St, Suite 200", after: "880 Market Avenue, Suite 410" },
    { field: "Effective date", before: "—", after: "Oct 1, 2026" },
  ],
}];

export const activity = [
  { icon: "check", title: "Enrollment changed to Approved", meta: "Atlas Health Plan · RUN-2841", time: "6m" },
  { icon: "pause", title: "Submission awaiting approval", meta: "Meridian Choice · RUN-2840", time: "24m" },
  { icon: "refresh", title: "Semantic recovery succeeded", meta: "Provider profile relocated · retry 2/3", time: "26m" },
  { icon: "camera", title: "Evidence bundle sealed", meta: "8 artifacts · SHA-256 manifest", time: "41m" },
];
