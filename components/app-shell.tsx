"use client";

import {
  Activity, Bell, Bot, Boxes, CheckSquare, CircleGauge, FileArchive, GitBranch,
  HelpCircle, Plug, Search, Settings, ShieldCheck, Sparkles, Workflow,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  ["Dashboard", "/", CircleGauge],
  ["Workflows", "/workflows", Workflow],
  ["Runs", "/runs", Activity],
  ["Approvals", "/approvals", CheckSquare],
  ["Agents", "/agents", Bot],
  ["Evidence", "/evidence", FileArchive],
  ["Integrations", "/integrations", Plug],
] as const;

export function AppShell({ children, title = "Operations overview" }: { children: React.ReactNode; title?: string }) {
  const pathname = usePathname();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><GitBranch size={16} /></div><span>PortalOps AI</span></div>
        <div className="nav-label">Workspace</div>
        <nav>
          {nav.map(([label, href, Icon]) => (
            <Link className={`nav-item ${pathname === href ? "active" : ""}`} href={href} key={href}>
              <Icon size={16} strokeWidth={1.8} /><span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="nav-label" style={{ marginTop: 12 }}>Manage</div>
        <nav>
          <Link className={`nav-item ${pathname === "/settings" ? "active" : ""}`} href="/settings"><Settings size={16} /><span>Settings</span></Link>
          <Link className="nav-item" href="/security"><ShieldCheck size={16} /><span>Trust & safety</span></Link>
          <Link className="nav-item" href="/help"><HelpCircle size={16} /><span>Help center</span></Link>
        </nav>
        <div className="sidebar-bottom">
          <div className="workspace-name"><div className="avatar">NM</div><div><div style={{ color: "white", fontSize: 12, fontWeight: 600 }}>Northstar Medical</div><div style={{ color: "#80968e", fontSize: 10, marginTop: 3 }}>Demo workspace</div></div></div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="top-actions">
            <span className="synthetic">SYNTHETIC DATA</span>
            <button className="icon-button" aria-label="Search"><Search size={15} /></button>
            <button className="icon-button" aria-label="Notifications"><Bell size={15} /></button>
            <div className="avatar">AS</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

export function ProductMark() {
  return <div className="feature-icon"><Boxes size={18} /></div>;
}

export function AiMark() {
  return <Sparkles size={15} />;
}
