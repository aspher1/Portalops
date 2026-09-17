import { describe, expect, it } from "vitest";
import {
  evaluateDemoSubmission,
  getDemoStage,
  initialDemoState,
  transitionDemo,
  type DemoDecision,
} from "@/lib/demo-workflow";

describe("synthetic demo workflow", () => {
  it("advances through a bounded deterministic path to approval", () => {
    let state = transitionDemo(initialDemoState, { type: "START" });
    expect(getDemoStage(state)).toBe(1);

    for (let expectedStage = 2; expectedStage <= 4; expectedStage++) {
      state = transitionDemo(state, { type: "ADVANCE" });
      expect(getDemoStage(state)).toBe(expectedStage);
    }

    expect(state).toEqual({ phase: "approval" });
    expect(transitionDemo(state, { type: "ADVANCE" })).toBe(state);
  });

  it.each<DemoDecision>(["approved", "rejected", "takeover"])(
    "supports the %s terminal decision",
    decision => {
      const state = transitionDemo({ phase: "approval" }, { type: "DECIDE", decision });
      expect(state).toEqual({ phase: "resolved", decision });
      expect(getDemoStage(state)).toBe(5);
      expect(transitionDemo(state, { type: "DECIDE", decision: "approved" })).toBe(state);
    },
  );

  it("ignores out-of-order actions and can restart any path", () => {
    expect(transitionDemo(initialDemoState, { type: "ADVANCE" })).toBe(initialDemoState);
    expect(transitionDemo({ phase: "executing", step: 1 }, { type: "DECIDE", decision: "approved" }))
      .toEqual({ phase: "executing", step: 1 });
    expect(transitionDemo({ phase: "resolved", decision: "rejected" }, { type: "RESTART" }))
      .toEqual(initialDemoState);
  });

  it("blocks the synthetic submission at a clear human policy gate", () => {
    expect(evaluateDemoSubmission()).toEqual({
      level: "medium",
      allowed: false,
      reason: "Submitting changes a payer-facing provider record, so policy requires a field-level human decision.",
      requiredAction: "human_decision",
    });
  });
});
