export const DEMO_EXECUTION_STEPS = [
  {
    title: "Locate provider profile",
    detail: "Opened the allowlisted synthetic Meridian portal and matched NPI ending 0198.",
  },
  {
    title: "Recover from portal drift",
    detail: "The saved “Locations” target moved. Re-anchored to the visible “Practice locations” heading on attempt 2 of 3.",
  },
  {
    title: "Stage proposed fields",
    detail: "Prepared the address and effective date in a local draft. Nothing has been submitted.",
  },
] as const;

export type DemoDecision = "approved" | "rejected" | "takeover";

export type DemoState =
  | { phase: "configured" }
  | { phase: "executing"; step: number }
  | { phase: "approval" }
  | { phase: "resolved"; decision: DemoDecision };

export type DemoAction =
  | { type: "START" }
  | { type: "ADVANCE" }
  | { type: "DECIDE"; decision: DemoDecision }
  | { type: "RESTART" };

export const initialDemoState: DemoState = { phase: "configured" };

export function transitionDemo(state: DemoState, action: DemoAction): DemoState {
  if (action.type === "RESTART") return initialDemoState;

  if (state.phase === "configured" && action.type === "START") {
    return { phase: "executing", step: 0 };
  }

  if (state.phase === "executing" && action.type === "ADVANCE") {
    if (state.step < DEMO_EXECUTION_STEPS.length - 1) {
      return { phase: "executing", step: state.step + 1 };
    }
    return { phase: "approval" };
  }

  if (state.phase === "approval" && action.type === "DECIDE") {
    return { phase: "resolved", decision: action.decision };
  }

  return state;
}

export type DemoRiskAssessment = {
  level: "medium";
  allowed: false;
  reason: string;
  requiredAction: "human_decision";
};

export function evaluateDemoSubmission(): DemoRiskAssessment {
  return {
    level: "medium",
    allowed: false,
    reason: "Submitting changes a payer-facing provider record, so policy requires a field-level human decision.",
    requiredAction: "human_decision",
  };
}

export function getDemoStage(state: DemoState): number {
  if (state.phase === "configured") return 0;
  if (state.phase === "executing") return state.step + 1;
  if (state.phase === "approval") return 4;
  return 5;
}
