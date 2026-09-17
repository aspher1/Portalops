"use client";

import {
  ArrowRight, Bot, Check, CircleDot, Database, ExternalLink, FileArchive, Globe2, KeyRound,
  LockKeyhole, Play, Plug, Radar, Settings2, ShieldCheck, Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
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
  product: { title: "Supervised portal operations", description: "Reliable administrative automation with bounded execution, human judgment, and evidence at every consequential step." },
  security: { title: "Trust & safety", description: "Controls that keep browser execution scoped, reviewable, and tenant-isolated." },
  pricing: { title: "Plans built around operational value", description: "Start with a focused workflow pilot, then expand volume and governance as reliability is proven." },
  demo: { title: "Synthetic operations demo", description: "Explore an end-to-end provider enrollment workflow without connecting a real payer or using protected health information." },
  help: { title: "Help center", description: "Understand PortalOps concepts and operate the synthetic demo." },
};

type FeatureCard = { icon: LucideIcon; title: string; text: string; action: string; href: string };

const workflowCards: FeatureCard[] = [
  { icon: Radar, title: "Enrollment status check", text: "Find a provider record, extract status and effective date, compare with the last observation, and seal evidence.", action: "Run demo", href: "/demo" },
  { icon: Workflow, title: "Practice address update", text: "Stage an address update and effective date, then pause before submission for human approval.", action: "Preview workflow", href: "/" },
  { icon: Database, title: "Roster verification", text: "Verify a synthetic roster against portal records and surface discrepancies for review.", action: "Run synthetic demo", href: "/demo" },
];

function Runs() {
  return <section className="card"><div className="card-head"><h2>Execution history</h2><Link className="button primary" href="/"><Play size={13} /> Start from dashboard</Link></div><div style={{ overflowX: "auto" }}><table className="table"><thead><tr><th>Run</th><th>Workflow</th><th>Progress</th><th>Status</th></tr></thead><tbody>{runs.map(run => <tr key={run.id}><td className="strong">{run.id}</td><td><div className="strong">{run.workflow}</div><div className="meta">{run.payer}</div></td><td>{run.progress}%</td><td><span className={`pill ${run.status}`}><span className="dot" />{run.status.replaceAll("_", " ")}</span></td></tr>)}</tbody></table></div></section>;
}

function Cards({ section }: { section: string }) {
  const cards: FeatureCard[] = section === "workflows" ? workflowCards : section === "agents" ? [
    { icon: Bot, title: "Atlas operator", text: "Status checks and profile updates on the Atlas synthetic portal. Domain-scoped; 3-attempt budget.", action: "Open Atlas portal", href: "/portals/atlas" },
    { icon: Bot, title: "Meridian operator", text: "Read and staged-write capability. All submissions require approval.", action: "Open Meridian portal", href: "/portals/meridian" },
    { icon: Radar, title: "Recovery monitor", text: "Detects locator drift and re-anchors using visible labels and landmarks.", action: "View run events", href: "/runs" },
  ] : section === "evidence" ? [
    { icon: FileArchive, title: "RUN-2841 bundle", text: "8 artifacts · screenshot, extracted fields, event log, SHA-256 manifest.", action: "Review source run", href: "/runs" },
    { icon: FileArchive, title: "RUN-2840 draft", text: "6 artifacts captured before the approval boundary.", action: "Review approval", href: "/" },
    { icon: LockKeyhole, title: "Retention policy", text: "Demo retention is set to 30 days. Production storage is not configured.", action: "Review security model", href: "/security" },
  ] : section === "integrations" ? [
    { icon: Globe2, title: "Atlas Health Plan", text: "Synthetic payer portal · connected · read and staged-write capabilities.", action: "Open portal", href: "/portals/atlas" },
    { icon: Globe2, title: "Meridian Choice", text: "Synthetic payer portal · connected · approval required for submission.", action: "Open portal", href: "/portals/meridian" },
    { icon: Plug, title: "Webhook destination", text: "Send signed run and approval events to your operations system.", action: "Read integration guidance", href: "/help" },
  ] : section === "product" ? [
    { icon: Workflow, title: "Structured workflows", text: "Versioned procedures combine deterministic browser actions, validation, bounded retries, and explicit success criteria.", action: "Explore workflows", href: "/workflows" },
    { icon: ShieldCheck, title: "Supervision by design", text: "Consequential actions stop at clear approval boundaries with field-level changes and supporting evidence.", action: "Review approvals", href: "/approvals" },
    { icon: FileArchive, title: "Defensible evidence", text: "Operational histories preserve actions, extracted values, screenshots, approvals, and artifact digests.", action: "Inspect evidence", href: "/evidence" },
  ] : section === "pricing" ? [
    { icon: Radar, title: "Pilot", text: "A focused workflow and synthetic validation environment for teams proving operational fit and baseline ROI.", action: "Explore the demo", href: "/demo" },
    { icon: Workflow, title: "Growth", text: "Higher run volume, expanded workflow coverage, operational analytics, and standard integrations.", action: "Review the product", href: "/product" },
    { icon: LockKeyhole, title: "Enterprise", text: "Custom policies, advanced access controls, deployment options, and enhanced implementation support.", action: "Review security", href: "/security" },
  ] : section === "demo" ? [
    { icon: Play, title: "Enrollment status check", text: "Watch PortalOps locate a synthetic provider record, extract structured status, and seal an evidence bundle.", action: "Start guided demo", href: "/" },
    { icon: Globe2, title: "Atlas portal", text: "Traditional payer layout with enrollment records, references, and provider demographics.", action: "Open synthetic portal", href: "/portals/atlas" },
    { icon: Globe2, title: "Meridian portal", text: "Alternate portal vocabulary and structure used to demonstrate semantic recovery.", action: "Compare portal", href: "/portals/meridian" },
  ] : section === "security" ? [
    { icon: LockKeyhole, title: "Tenant boundaries", text: "Server authorization and PostgreSQL row policies scope operational records to one organization.", action: "Inspect the demo workspace", href: "/" },
    { icon: ShieldCheck, title: "Execution policy", text: "Exact-host restrictions, typed actions, approval gates, and bounded retries constrain browser behavior.", action: "Review approvals", href: "/approvals" },
    { icon: FileArchive, title: "Auditability", text: "Append-oriented events and immutable artifact digests support inspection without claiming certification.", action: "Inspect evidence", href: "/evidence" },
  ] : section === "help" ? [
    { icon: Play, title: "Guided demo", text: "Walk through the synthetic enrollment and approval experience without real portal credentials.", action: "Open demo", href: "/demo" },
    { icon: Workflow, title: "Product overview", text: "Understand how deterministic automation, recovery, supervision, and evidence fit together.", action: "Explore product", href: "/product" },
    { icon: Radar, title: "Plans and pilots", text: "Review the proposed commercial packaging for focused workflow validation and expansion.", action: "View pricing", href: "/pricing" },
  ] : [
    { icon: KeyRound, title: "Access & roles", text: "Operator, approver, and administrator roles are separated by workspace.", action: "Review trust model", href: "/security" },
    { icon: ShieldCheck, title: "Execution policy", text: "Allowed domains, action budgets, approval boundaries, and injection detection.", action: "Review approvals", href: "/approvals" },
    { icon: Settings2, title: "Workspace", text: "Northstar Medical Group · synthetic demo · tenant_northstar.", action: "Return to workspace", href: "/" },
  ];
  return <div className="section-grid">{cards.map(({ icon: Icon, title, text, action, href }) => <article className="card feature-card" key={title}><div className="feature-icon"><Icon size={17} /></div><h2>{title}</h2><p className="subtle">{text}</p><Link className="button" href={href}>{action} <ExternalLink size={12} /></Link></article>)}</div>;
}

const commercial = new Set(["product", "pricing", "security", "demo"]);

export function SectionPage({ section }: { section: string }) {
  const info = copy[section] ?? { title: "PortalOps", description: "Supervised enrollment operations." };
  const isCommercial = commercial.has(section);
  return <AppShell title={info.title}><div className="content">
    {isCommercial ? <>
      <section className="commercial-hero">
        <div className="commercial-copy">
          <div className="eyebrow">{section === "security" ? "Bounded execution / visible control" : section === "pricing" ? "Commercial model / no hidden claims" : section === "demo" ? "Synthetic environment / zero PHI" : "Portal operations / supervised by design"}</div>
          <h1>{info.title}</h1>
          <p className="subtle">{info.description}</p>
          <div className="commercial-actions">
            <Link className="button primary" href={section === "demo" ? "/" : "/demo"}>{section === "demo" ? "Enter workspace" : "Explore synthetic demo"} <ArrowRight size={13} /></Link>
            <Link className="button" href={section === "security" ? "/evidence" : "/security"}>{section === "security" ? "Inspect evidence model" : "Review trust model"}</Link>
          </div>
        </div>
      </section>
      <div className="assurance-strip" aria-label="Product principles">
        <div className="assurance-item"><strong>Human authorization</strong><span>Before consequential writes</span></div>
        <div className="assurance-item"><strong>Bounded recovery</strong><span>Explicit attempt budgets</span></div>
        <div className="assurance-item"><strong>Evidence attached</strong><span>Actions remain inspectable</span></div>
        <div className="assurance-item"><strong>Synthetic by default</strong><span>No real patient data in this MVP</span></div>
      </div>
    </> : <div className="page-head"><div><div className="page-overline">PortalOps / {section}</div><h1>{info.title}</h1><p className="subtle">{info.description}</p></div>{section === "approvals" && <span className="pill pending"><CircleDot size={9} /> 3 pending</span>}</div>}
    {section === "runs" ? <Runs /> : section === "approvals" ? <section className="card empty-note"><Check size={25} color="#087a5b" style={{ margin: "0 auto 12px" }} /><h2>One approval is highlighted on Dashboard</h2><p className="subtle" style={{ marginTop: 8 }}>Review the flagship address update, including its field-level diff and external-side-effect boundary.</p><Link href="/" className="button primary" style={{ marginTop: 18 }}>Review request</Link></section> : <Cards section={section} />}
  </div></AppShell>;
}
