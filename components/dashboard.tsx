"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity, ArrowRight, Check, CheckCircle2, Clock3, FileCheck2, MoreHorizontal, Pause,
  Play, RefreshCw, ShieldAlert, Sparkles, UserCheck, X, MonitorUp, Zap,
} from "lucide-react";
import { activity, approvals, runs } from "@/lib/demo-data";
import { AppShell } from "./app-shell";

function Status({ value }: { value: string }) {
  return <span className={`pill ${value}`}><span className="dot" />{value.replaceAll("_", " ")}</span>;
}

export function Dashboard() {
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "rejected" | "human_takeover">("pending");
  const [message, setMessage] = useState<string | null>(null);
  const approval = approvals[0];

  function decide(status: "approved" | "rejected" | "human_takeover") {
    setApprovalStatus(status);
    setMessage(status === "approved"
      ? "Approval recorded. RUN-2840 may resume its single authorized submission step."
      : status === "rejected"
        ? "Change rejected. The staged portal update was discarded."
        : "Human takeover requested. Agent execution is paused and the handoff is recorded.");
  }

  return (
    <AppShell pendingApprovals={approvalStatus === "pending" ? 3 : 2}>
      <div className="content">
        <div className="page-head">
          <div><div className="page-overline"><span className="live-signal" /> Thursday, September 17 · 09:48 CDT</div><h1>Operations overview</h1><p className="subtle">Three decisions require attention across your enrollment network.</p></div>
          <button className="button primary" onClick={() => setMessage("Demo run queued with a 3-attempt budget and approval gate.")}><Play size={13} fill="currentColor" /> New run</button>
        </div>
        {message && <div className="notice" role="status">{message}</div>}
        <div className="metrics">
          <div className="card metric"><div className="metric-top"><span>Active runs</span><Activity size={15} /></div><div className="metric-value">12</div><div className="trend"><span>+3</span> since yesterday</div></div>
          <div className="card metric priority"><div className="metric-top"><span>Needs approval</span><UserCheck size={15} /></div><div className="metric-value">0{approvalStatus === "pending" ? 3 : 2}</div><div className="trend warning"><span>{approvalStatus === "pending" ? "24m" : "11m"}</span> oldest wait</div></div>
          <div className="card metric"><div className="metric-top"><span>Completed / 7d</span><CheckCircle2 size={15} /></div><div className="metric-value">47</div><div className="trend"><span>96%</span> completion rate</div></div>
          <div className="card metric"><div className="metric-top"><span>Capacity returned</span><Clock3 size={15} /></div><div className="metric-value">18.6<span className="metric-unit">h</span></div><div className="trend neutral">Configured baseline estimate</div></div>
        </div>

        <div className="dashboard-grid">
          <section className="card">
            <div className="card-head"><div><div className="card-label">Execution ledger</div><h2>Recent runs</h2><p className="meta">Supervised activity across connected portals</p></div><Link className="text-link" href="/runs">View ledger <ArrowRight size={13} /></Link></div>
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead><tr><th>Workflow</th><th>Status</th><th>Payer</th><th>Started</th></tr></thead>
                <tbody>{runs.map((run) => <tr key={run.id}>
                  <td><Link className="run-link" href={`/runs/${run.id}`}>{run.workflow}</Link><div className="meta">{run.id} · {run.provider}</div></td>
                  <td><Status value={run.status} /></td><td>{run.payer}</td><td className="table-time">{run.startedAt}</td>
                </tr>)}</tbody>
              </table>
            </div>
          </section>
          <section className="card">
            <div className="card-head"><div><div className="card-label">Signal stream</div><h2>Live activity</h2><p className="meta">Explainable agent events</p></div><span className="pill running"><span className="dot" />Live</span></div>
            <div className="activity-list">{activity.map((item) => (
              <div className="activity" key={item.title}>
                <div className="activity-icon">{item.icon === "check" ? <Check size={13} /> : item.icon === "pause" ? <Pause size={13} /> : item.icon === "refresh" ? <RefreshCw size={13} /> : <FileCheck2 size={13} />}</div>
                <div><div className="activity-title">{item.title}</div><div className="meta">{item.meta}</div></div><div className="activity-time">{item.time}</div>
              </div>
            ))}</div>
          </section>
        </div>

        <section className="card approval-card">
          <div className="card-head">
            <div><div className="eyebrow approval-kicker"><ShieldAlert size={11} /> Decision checkpoint · {approval.id}</div><h2>{approval.title}</h2></div>
            <Status value={approvalStatus} />
          </div>
          <div className="approval-body">
            {approvalStatus === "pending" ? <>
              <div className="approval-layout">
                <div className="approval-main">
                  <div className="approval-banner"><ShieldAlert size={17} /><div><div className="strong">External side effect paused</div><div className="meta">Submission is policy-gated until a workspace approver authorizes this exact change set.</div></div></div>
                  <p className="subtle approval-summary">{approval.summary}</p>
                  <div className="changes">
                    <div className="change-head"><span>Proposed change</span><span>Current value</span><span>Staged value</span></div>
                    {approval.changes.map((change) => <div className="change" key={change.field}><div className="strong">{change.field}</div><span className="before">{change.before}</span><span className="after">{change.after}</span></div>)}
                  </div>
                </div>
                <aside className="approval-rail">
                  <div className="rail-heading"><Zap size={13} /> Execution context</div>
                  <dl className="approval-context">
                    <div><dt>Target</dt><dd>Meridian Choice<br/><span>Provider profile</span></dd></div>
                    <div><dt>Risk class</dt><dd><span className="risk-indicator" /> Medium · external write</dd></div>
                    <div><dt>Requested by</dt><dd>Atlas agent<br/><span>24 minutes ago</span></dd></div>
                    <div><dt>Evidence</dt><dd>6 sealed artifacts<br/><span>RUN-2840</span></dd></div>
                  </dl>
                  <Link className="evidence-link" href="/evidence">Inspect evidence bundle <ArrowRight size={12} /></Link>
                </aside>
              </div>
              <div className="approval-footer">
                <span><ShieldAlert size={13} /> Decision will be appended to the audit history</span>
                <div className="approval-actions"><button className="button" onClick={() => decide("human_takeover")}><MonitorUp size={13} /> Take control</button><button className="button danger" onClick={() => decide("rejected")}><X size={13} /> Reject</button><button className="button primary" onClick={() => decide("approved")}><Check size={13} /> Approve & resume</button><button className="icon-button more-button" aria-label="More approval options"><MoreHorizontal size={15} /></button></div>
              </div>
            </> : <div className="empty-note"><Sparkles size={22} color="#087a5b" style={{ margin: "0 auto 10px" }} /><h2>Decision recorded</h2><p className="subtle" style={{ marginTop: 7 }}>{message}</p></div>}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
