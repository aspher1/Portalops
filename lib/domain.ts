export type RunStatus = "queued" | "running" | "needs_approval" | "completed" | "failed";
export type StepStatus = "pending" | "running" | "completed" | "blocked" | "failed";

export interface WorkflowStep {
  id: string;
  label: string;
  kind: "navigate" | "extract" | "compare" | "write" | "submit" | "evidence";
  targetUrl?: string;
  status: StepStatus;
  destructive: boolean;
  attempts: number;
}

export interface WorkflowRun {
  id: string;
  tenantId: string;
  workflow: string;
  payer: string;
  provider: string;
  status: RunStatus;
  startedAt: string;
  progress: number;
  steps: WorkflowStep[];
}

export interface Approval {
  id: string;
  tenantId: string;
  runId: string;
  title: string;
  summary: string;
  requestedBy: string;
  createdAt: string;
  risk: "low" | "medium" | "high";
  status: "pending" | "approved" | "rejected";
  changes: { field: string; before: string; after: string }[];
}

export const DEMO_TENANT = "tenant_northstar";
