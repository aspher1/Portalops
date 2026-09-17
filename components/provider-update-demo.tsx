"use client";

import {
  AlertTriangle, ArrowRight, Check, CheckCircle2, Circle, FileArchive, Hand,
  MapPin, Play, RefreshCcw, RotateCcw, ShieldCheck, UserRound, X,
} from "lucide-react";
import { useReducer } from "react";
import {
  DEMO_EXECUTION_STEPS,
  evaluateDemoSubmission,
  getDemoStage,
  initialDemoState,
  transitionDemo,
  type DemoDecision,
  type DemoState,
} from "@/lib/demo-workflow";

const stages = ["Inputs", "Locate", "Recover", "Stage", "Approval", "Result"];
const changes = [
  { field: "Practice address", before: "245 West Arbor St, Suite 200", after: "880 Market Avenue, Suite 410" },
  { field: "Effective date", before: "Not set", after: "October 1, 2026" },
];

const resultCopy: Record<DemoDecision, { title: string; detail: string; status: string }> = {
  approved: {
    title: "Synthetic update completed",
    detail: "The one staged submission was authorized and a synthetic confirmation was captured.",
    status: "Completed",
  },
  rejected: {
    title: "Update safely rejected",
    detail: "The staged draft was discarded. No submission was attempted.",
    status: "Rejected — no effect",
  },
  takeover: {
    title: "Control transferred to operator",
    detail: "Automation stopped at the approval boundary. The synthetic browser context is marked for human review.",
    status: "Human takeover",
  },
};

function statusText(state: DemoState) {
  if (state.phase === "configured") return "Ready. Review the synthetic inputs, then start the run.";
  if (state.phase === "executing") return `Running: ${DEMO_EXECUTION_STEPS[state.step].title}.`;
  if (state.phase === "approval") return "Paused before submission. A human decision is required because this step changes a payer-facing record.";
  return `${resultCopy[state.decision].status}. The synthetic run has ended.`;
}

export function ProviderUpdateDemo() {
  const [state, dispatch] = useReducer(transitionDemo, initialDemoState);
  const stage = getDemoStage(state);
  const risk = evaluateDemoSubmission();

  return (
    <div className="demo">
      <section className="demo-hero">
        <div>
          <div className="eyebrow">Interactive synthetic run / client-side only</div>
          <h1>Provider address update, supervised end to end</h1>
          <p>Follow a deterministic portal run from configured inputs through recovery, policy review, and a human-controlled outcome.</p>
        </div>
        <div className="demo-safety">
          <ShieldCheck size={18} aria-hidden="true" />
          <div><strong>Safe demonstration</strong><span>No real portal, persistence, PHI, or external effect.</span></div>
        </div>
      </section>

      <nav className="demo-stage-nav" aria-label="Demonstration progress">
        {stages.map((label, index) => {
          const complete = index < stage || state.phase === "resolved";
          const current = index === stage && state.phase !== "resolved";
          return (
            <div className={`demo-stage ${complete ? "complete" : ""} ${current ? "current" : ""}`} key={label} aria-current={current ? "step" : undefined}>
              <span>{complete ? <Check size={12} /> : index + 1}</span>
              <strong>{label}</strong>
              <small>{complete ? "Complete" : current ? "Current" : "Not started"}</small>
            </div>
          );
        })}
      </nav>

      <div className="demo-status" role="status" aria-live="polite">
        {state.phase === "approval" ? <AlertTriangle size={17} /> : state.phase === "resolved" ? <CheckCircle2 size={17} /> : <Circle size={15} />}
        <div><strong>{state.phase === "approval" ? "Why PortalOps paused" : "Run status"}</strong><span>{statusText(state)}</span></div>
      </div>

      <div className="demo-layout">
        <main className="card demo-workspace">
          {state.phase === "configured" && <Configuration />}
          {state.phase === "executing" && <Execution step={state.step} />}
          {state.phase === "approval" && <Approval />}
          {state.phase === "resolved" && <Result decision={state.decision} />}

          <footer className="demo-controls">
            <span>Step {stage + 1} of {stages.length} · progression is bounded</span>
            <div>
              {state.phase !== "configured" && <button className="button" type="button" onClick={() => dispatch({ type: "RESTART" })}><RotateCcw size={13} /> Restart</button>}
              {state.phase === "configured" && <button className="button primary" type="button" onClick={() => dispatch({ type: "START" })}><Play size={13} /> Start synthetic run</button>}
              {state.phase === "executing" && <button className="button primary" type="button" onClick={() => dispatch({ type: "ADVANCE" })}>
                {state.step === DEMO_EXECUTION_STEPS.length - 1 ? "Review policy gate" : "Continue execution"} <ArrowRight size={13} />
              </button>}
              {state.phase === "approval" && <>
                <button className="button danger" type="button" onClick={() => dispatch({ type: "DECIDE", decision: "rejected" })}><X size={13} /> Reject</button>
                <button className="button" type="button" onClick={() => dispatch({ type: "DECIDE", decision: "takeover" })}><Hand size={13} /> Take control</button>
                <button className="button primary" type="button" onClick={() => dispatch({ type: "DECIDE", decision: "approved" })}><Check size={13} /> Approve</button>
              </>}
            </div>
          </footer>
        </main>

        <aside className="demo-rail">
          <section className="card demo-facts">
            <div className="card-head"><div><div className="card-label">Run scope</div><h2>Synthetic configuration</h2></div><span className="synthetic">IN MEMORY</span></div>
            <dl>
              <div><dt>Provider</dt><dd>Northstar Medical Group</dd></div>
              <div><dt>Provider ID</dt><dd>NPI ••••••0198 (synthetic)</dd></div>
              <div><dt>Payer</dt><dd>Meridian Choice (synthetic)</dd></div>
              <div><dt>Allowed host</dt><dd>portal.meridian.test</dd></div>
              <div><dt>Attempt budget</dt><dd>3 per operation</dd></div>
            </dl>
          </section>
          <section className="card demo-facts">
            <div className="card-head"><div><div className="card-label">Policy evaluation</div><h2>Submission gate</h2></div><span className="pill needs_approval"><span className="dot" />{risk.level} risk</span></div>
            <p className="subtle">{risk.reason}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Configuration() {
  return <div className="demo-panel">
    <div className="demo-panel-head"><div className="feature-icon"><UserRound size={17} /></div><div><div className="eyebrow">Stage 1 / configured inputs</div><h2>Confirm what this run will do</h2><p className="subtle">PortalOps will locate one synthetic provider, stage two fields, and stop before submission.</p></div></div>
    <div className="demo-input-grid">
      <div><span>Workflow</span><strong>Practice address update</strong></div>
      <div><span>Target record</span><strong>Northstar Medical · •0198</strong></div>
      <div><span>New address</span><strong>880 Market Avenue, Suite 410</strong></div>
      <div><span>Effective date</span><strong>October 1, 2026</strong></div>
    </div>
    <div className="demo-explainer"><ShieldCheck size={16} /><span>The run may read and stage local values. Policy prohibits submission without an explicit decision below.</span></div>
  </div>;
}

function Execution({ step }: { step: number }) {
  return <div className="demo-panel">
    <div className="demo-panel-head"><div className="feature-icon">{step === 1 ? <RefreshCcw size={17} /> : <MapPin size={17} />}</div><div><div className="eyebrow">Deterministic portal execution</div><h2>{DEMO_EXECUTION_STEPS[step].title}</h2><p className="subtle">{DEMO_EXECUTION_STEPS[step].detail}</p></div></div>
    <ol className="demo-event-list">
      {DEMO_EXECUTION_STEPS.map((item, index) => <li className={index < step ? "done" : index === step ? "active" : ""} key={item.title}>
        <span>{index < step ? <Check size={12} /> : index + 1}</span>
        <div><strong>{item.title}</strong><small>{index < step ? item.detail : index === step ? "Current deterministic operation" : "Waiting"}</small></div>
      </li>)}
    </ol>
    {step === 1 && <div className="recovery-callout"><RefreshCcw size={17} /><div><strong>Semantic recovery succeeded</strong><span>Exact locator was unavailable. PortalOps used the visible heading and form label—not free-form instructions—to relocate the field. Attempt 2 of 3.</span></div></div>}
  </div>;
}

function Approval() {
  return <div className="demo-panel">
    <div className="demo-panel-head"><div className="feature-icon approval-icon"><ShieldCheck size={17} /></div><div><div className="eyebrow">Required human decision</div><h2>Approve exactly these proposed fields?</h2><p className="subtle">Approve authorizes this one synthetic submission only. Reject discards it; Take control stops automation for operator review.</p></div></div>
    <div className="changes demo-changes">
      <div className="change-head"><span>Field</span><span>Current portal value</span><span>Proposed value</span></div>
      {changes.map(change => <div className="change" key={change.field}><strong>{change.field}</strong><span className="before">{change.before}</span><span className="after">{change.after}</span></div>)}
    </div>
    <div className="approval-reason"><AlertTriangle size={17} /><div><strong>Paused by side-effect policy · medium risk</strong><span>Submission would change a payer-facing provider record. No click or network request has occurred.</span></div></div>
  </div>;
}

function Result({ decision }: { decision: DemoDecision }) {
  const result = resultCopy[decision];
  return <div className="demo-panel">
    <div className="result-heading">
      <div className={`result-mark ${decision}`}>{decision === "rejected" ? <X /> : decision === "takeover" ? <Hand /> : <Check />}</div>
      <div><div className="eyebrow">Final structured result</div><h2>{result.title}</h2><p className="subtle">{result.detail}</p></div>
    </div>
    <dl className="result-grid">
      <div><dt>Run ID</dt><dd>DEMO-ADDR-001</dd></div>
      <div><dt>Outcome</dt><dd>{result.status}</dd></div>
      <div><dt>Decision scope</dt><dd>One synthetic address submission</dd></div>
      <div><dt>External effect</dt><dd>None — client-side demonstration</dd></div>
    </dl>
    <div className="evidence-summary">
      <FileArchive size={20} />
      <div><strong>Evidence bundle summary</strong><span>{decision === "approved" ? "7" : "6"} in-memory artifacts: input snapshot, navigation policy, recovery event, field diff, decision event{decision === "approved" ? ", synthetic confirmation" : ""}, and structured result.</span></div>
      <span className="pill completed">Prepared</span>
    </div>
    <div className="estimate"><strong>Estimated manual time saved: 14 minutes</strong><span>Estimate only, based on a configured 18-minute manual baseline minus 4 minutes of review; not measured or guaranteed.</span></div>
  </div>;
}
