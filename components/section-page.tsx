"use client";

import {
  Bot, Check, CircleDot, Database, ExternalLink, FileArchive, Globe2, KeyRound,
  LockKeyhole, Play, Plug, Radar, Settings2, ShieldCheck, Workflow,
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "./app-shell";
import { runs } from "@/lib/demo-data";

const copy: Record<string, { title: string; description: string }> = {
  workflows: { title: "Workflows", description: "Reusable, versioned procedures with explicit inputs, policies, and approval gates." },
  runs: { title: "Runs", description: "Inspect every agent decision, retry, artifact, and human handoff." },
  approvals: { title: "Approvals", description: "Review staged portal changes before they create external side effects." },
  agents: { title: "Agents", description: "Bounded operators assigned to specific payers and workflow capabilities." },
  evidence: { title: "Evidence", description: "Tamper-evident screenshots, field snapshots, and execution manifests." },
  integrations: { title: "Integrations", description: "Connect approved payer portals and your downstream operations stack." },
  settings: { title: "Settings", description: "Workspace policy, access, retention, and notification controls." },
  security: { title: "Trust & safety", description: "Controls that keep browser execution scoped, reviewable, and tenant-isolated." },
  help: { title: "Help center", description: "Understand PortalOps concepts and operate the synthetic demo." },
};

const workflowCards = [
  { icon: Radar, title: "Enrollment status check", text: "Find a provider record, extract status and effective date, compare with the last observation, and seal evidence.", action: "Run demo" },
  { icon: Workflow, title: "Practice address update", text: "Stage an address update and effective date, then pause before submission for human approval.", action: "Preview workflow" },
  { icon: Database, title: "Roster verification", text: "Verify a synthetic roster against portal records and surface discrepancies for review.", action: "Configure" },
];

function Runs() {
  return <section className="card"><div className="card-head"><h2>Execution history</h2><button className="button primary"><Play size={13} /> New run</button></div><table className="table"><thead><tr><th>Run</th><th>Workflow</th><th>Progress</th><th>Status</th></tr></thead><tbody>{runs.map(run => <tr key={run.id}><td className="strong">{run.id}</td><td><div className="strong">{run.workflow}</div><div className="meta">{run.payer}</div></td><td>{run.progress}%</td><td><span className={`pill ${run.status}`}><span className="dot" />{run.status.replaceAll("_", " ")}</span></td></tr>)}</tbody></table></section>;
}

function Cards({ section }: { section: string }) {
  const cards = section === "workflows" ? workflowCards : section === "agents" ? [
    { icon: Bot, title: "Atlas operator", text: "Status checks and profile updates on the Atlas synthetic portal. Domain-scoped; 3-attempt budget.", action: "Inspect agent" },
    { icon: Bot, title: "Meridian operator", text: "Read and staged-write capability. All submissions require approval.", action: "Inspect agent" },
    { icon: Radar, title: "Recovery monitor", text: "Detects locator drift and re-anchors using visible labels and landmarks.", action: "View events" },
  ] : section === "evidence" ? [
    { icon: FileArchive, title: "RUN-2841 bundle", text: "8 artifacts · screenshot, extracted fields, event log, SHA-256 manifest.", action: "Open bundle" },
    { icon: FileArchive, title: "RUN-2840 draft", text: "6 artifacts captured before the approval boundary.", action: "Inspect evidence" },
    { icon: LockKeyhole, title: "Retention policy", text: "Demo retention is set to 30 days. Production storage is not configured.", action: "Configure" },
  ] : section === "integrations" ? [
    { icon: Globe2, title: "Atlas Health Plan", text: "Synthetic payer portal · connected · read and staged-write capabilities.", action: "Open portal" },
    { icon: Globe2, title: "Meridian Choice", text: "Synthetic payer portal · connected · approval required for submission.", action: "Open portal" },
    { icon: Plug, title: "Webhook destination", text: "Send signed run and approval events to your operations system.", action: "Connect" },
  ] : [
    { icon: KeyRound, title: "Access & roles", text: "Operator, approver, and administrator roles are separated by workspace.", action: "Manage access" },
    { icon: ShieldCheck, title: "Execution policy", text: "Allowed domains, action budgets, approval boundaries, and injection detection.", action: "Review policy" },
    { icon: Settings2, title: "Workspace", text: "Northstar Medical Group · synthetic demo · tenant_northstar.", action: "Edit workspace" },
  ];
  return <div className="section-grid">{cards.map(({ icon: Icon, title, text, action }) => <article className="card feature-card" key={title}><div className="feature-icon"><Icon size={17} /></div><h2>{title}</h2><p className="subtle">{text}</p><button className="button">{action} <ExternalLink size={12} /></button></article>)}</div>;
}

export function SectionPage({ section }: { section: string }) {
  const info = copy[section] ?? { title: "PortalOps", description: "Supervised enrollment operations." };
  return <AppShell title={info.title}><div className="content"><div className="page-head"><div><h1>{info.title}</h1><p className="subtle">{info.description}</p></div>{section === "approvals" && <span className="pill pending"><CircleDot size={9} /> 3 pending</span>}</div>{section === "runs" ? <Runs /> : section === "approvals" ? <section className="card empty-note"><Check size={25} color="#087a5b" style={{ margin: "0 auto 12px" }} /><h2>One approval is highlighted on Dashboard</h2><p className="subtle" style={{ marginTop: 8 }}>Review the flagship address update, including its field-level diff and external-side-effect boundary.</p><Link href="/" className="button primary" style={{ marginTop: 18 }}>Review request</Link></section> : <Cards section={section} />}</div></AppShell>;
}
