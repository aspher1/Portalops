"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Activity, ArrowRight, Check, CheckCircle2, Clock3, FileCheck2, Pause,
  Play, RefreshCw, ShieldAlert, Sparkles, UserCheck, X,
} from "lucide-react";
import { activity, approvals, runs } from "@/lib/demo-data";
import { AppShell } from "./app-shell";

function Status({ value }: { value: string }) {
  return <span className={`pill ${value}`}><span className="dot" />{value.replaceAll("_", " ")}</span>;
}

export function Dashboard() {
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved" | "rejected">("pending");
  const [message, setMessage] = useState<string | null>(null);
  const approval = approvals[0];

  function decide(status: "approved" | "rejected") {
    setApprovalStatus(status);
    setMessage(status === "approved"
      ? "Approval recorded. RUN-2840 may resume its single authorized submission step."
      : "Change rejected. The staged portal update was discarded.");
  }

  return (
    <AppShell>
      <div className="content">
        <div className="page-head">
          <div><h1>Good morning, Avery</h1><p className="subtle">Here&apos;s what your enrollment operations need today.</p></div>
          <button className="button primary" onClick={() => setMessage("Demo run queued with a 3-attempt budget and approval gate.")}><Play size={13} fill="currentColor" /> New run</button>
        </div>
        {message && <div className="notice" role="status">{message}</div>}
        <div className="metrics">
          <div className="card metric"><div className="metric-top"><span>Active runs</span><Activity size={15} /></div><div className="metric-value">12</div><div className="trend">↑ 3 since yesterday</div></div>
          <div className="card metric"><div className="metric-top"><span>Needs approval</span><UserCheck size={15} /></div><div className="metric-value">3</div><div className="trend" style={{ color: "#a96500" }}>Oldest waiting 24m</div></div>
          <div className="card metric"><div className="metric-top"><span>Completed this week</span><CheckCircle2 size={15} /></div><div className="metric-value">47</div><div className="trend">96% completion rate</div></div>
          <div className="card metric"><div className="metric-top"><span>Hours returned</span><Clock3 size={15} /></div><div className="metric-value">18.6</div><div className="trend">Based on configured baselines</div></div>
        </div>

        <div className="dashboard-grid">
          <section className="card">
            <div className="card-head"><div><h2>Recent runs</h2><p className="meta">Supervised activity across connected portals</p></div><Link className="button" href="/runs">View all <ArrowRight size={13} /></Link></div>
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead><tr><th>Workflow</th><th>Status</th><th>Payer</th><th>Started</th></tr></thead>
                <tbody>{runs.map((run) => <tr key={run.id}>
                  <td><div className="strong">{run.workflow}</div><div className="meta">{run.id} · {run.provider}</div></td>
                  <td><Status value={run.status} /></td><td>{run.payer}</td><td style={{ color: "#74817c" }}>{run.startedAt}</td>
                </tr>)}</tbody>
              </table>
            </div>
          </section>
          <section className="card">
            <div className="card-head"><div><h2>Live activity</h2><p className="meta">Explainable agent events</p></div><span className="pill running"><span className="dot" />Live</span></div>
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
            <div><div className="eyebrow" style={{ color: "#9a6008", marginBottom: 6 }}>Approval requested</div><h2>{approval.title}</h2></div>
            <Status value={approvalStatus} />
          </div>
          <div className="approval-body">
            {approvalStatus === "pending" ? <>
              <div className="approval-banner"><ShieldAlert size={17} color="#a96500" /><div><div className="strong">External side effect paused</div><div className="meta">The agent cannot submit this change until a workspace approver authorizes it.</div></div></div>
              <p className="subtle">{approval.summary}</p>
              <div className="changes">{approval.changes.map((change) => <div className="change" key={change.field}><div className="strong">{change.field}</div><div className="change-values"><span className="before">{change.before}</span><ArrowRight size={12} /><span className="after">{change.after}</span></div></div>)}</div>
              <div className="approval-actions"><button className="button danger" onClick={() => decide("rejected")}><X size={13} /> Reject</button><button className="button primary" onClick={() => decide("approved")}><Check size={13} /> Approve & resume</button></div>
            </> : <div className="empty-note"><Sparkles size={22} color="#087a5b" style={{ margin: "0 auto 10px" }} /><h2>Decision recorded</h2><p className="subtle" style={{ marginTop: 7 }}>{message}</p></div>}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
