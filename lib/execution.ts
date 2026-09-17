import { evaluateNavigation, inspectPortalText, requiresApproval } from "./policy";
import type { WorkflowStep } from "./domain";

export interface BrowserAdapter {
  navigate(url: string): Promise<void>;
  read(label: string): Promise<string>;
  act(instruction: string): Promise<void>;
  capture(name: string): Promise<{ path: string; digest: string }>;
}

export type StepResult =
  | { outcome: "completed"; attempts: number; evidence?: { path: string; digest: string } }
  | { outcome: "approval_required"; attempts: number }
  | { outcome: "blocked"; attempts: number; reason: string };

/**
 * A bounded executor: every operation has a fixed retry budget; destructive
 * actions stop before side effects; portal content is untrusted data.
 */
export async function executeStep(
  step: WorkflowStep,
  browser: BrowserAdapter,
  options: { maxAttempts?: number; approved?: boolean; allowedDomains?: readonly string[] } = {},
): Promise<StepResult> {
  const maxAttempts = options.maxAttempts ?? 3;
  if (requiresApproval(step.kind, step.destructive) && !options.approved) {
    return { outcome: "approval_required", attempts: 0 };
  }
  if (step.kind === "navigate") {
    if (!step.targetUrl) {
      return { outcome: "blocked", attempts: 0, reason: "navigation_target_required" };
    }
    const navigation = evaluateNavigation(step.targetUrl, options.allowedDomains ?? []);
    if (!navigation.allowed) {
      return { outcome: "blocked", attempts: 0, reason: navigation.reason };
    }
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (step.kind === "navigate") {
        await browser.navigate(step.targetUrl!);
      } else if (step.kind === "extract" || step.kind === "compare") {
        const content = await browser.read(step.label);
        const inspection = inspectPortalText(content);
        if (!inspection.safe) {
          return { outcome: "blocked", attempts: attempt, reason: inspection.reason };
        }
      } else if (step.kind === "evidence") {
        return { outcome: "completed", attempts: attempt, evidence: await browser.capture(step.id) };
      } else {
        await browser.act(step.label);
      }
      return { outcome: "completed", attempts: attempt };
    } catch (error) {
      if (attempt === maxAttempts) {
        return {
          outcome: "blocked",
          attempts: attempt,
          reason: error instanceof Error ? error.message : "unknown_browser_error",
        };
      }
      // Semantic recovery re-reads the page on the next bounded attempt.
      await browser.read("Re-anchor against visible labels and landmarks");
    }
  }
  return { outcome: "blocked", attempts: maxAttempts, reason: "retry_budget_exhausted" };
}
