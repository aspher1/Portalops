"use client";

import {
  Activity, Bell, Bot, Boxes, CheckSquare, CircleGauge, FileArchive, GitBranch,
  HelpCircle, Menu, Plug, Search, Settings, ShieldCheck, Sparkles, Workflow, X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = (items: typeof nav) => items.map(([label, href, Icon]) => (
    <Link
      aria-current={pathname === href ? "page" : undefined}
      className={`nav-item ${pathname === href ? "active" : ""}`}
      href={href}
      key={href}
      onClick={() => setMobileOpen(false)}
    >
      <Icon size={16} strokeWidth={1.7} /><span>{label}</span>
      {label === "Approvals" && <span className="nav-count">3</span>}
    </Link>
  ));

  return (
    <div className="app-shell">
      {mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><GitBranch size={16} /></div>
          <span>PortalOps <b>AI</b></span>
          <button className="sidebar-close" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>
        <div className="workspace-switcher">
          <div><span className="eyebrow">Active workspace</span><strong>Northstar Medical</strong></div>
          <span className="environment-dot" title="Demo environment" />
        </div>
        <div className="nav-label">Workspace</div>
        <nav>{links(nav)}</nav>
        <div className="nav-label" style={{ marginTop: 12 }}>Manage</div>
        <nav>
          <Link aria-current={pathname === "/settings" ? "page" : undefined} className={`nav-item ${pathname === "/settings" ? "active" : ""}`} href="/settings" onClick={() => setMobileOpen(false)}><Settings size={16} /><span>Settings</span></Link>
          <Link aria-current={pathname === "/security" ? "page" : undefined} className={`nav-item ${pathname === "/security" ? "active" : ""}`} href="/security" onClick={() => setMobileOpen(false)}><ShieldCheck size={16} /><span>Trust & safety</span></Link>
          <Link aria-current={pathname === "/help" ? "page" : undefined} className={`nav-item ${pathname === "/help" ? "active" : ""}`} href="/help" onClick={() => setMobileOpen(false)}><HelpCircle size={16} /><span>Help center</span></Link>
        </nav>
        <div className="sidebar-bottom">
          <div className="system-status"><span className="system-pulse" /><div><strong>Systems nominal</strong><span>4 agents available</span></div></div>
          <div className="workspace-name"><div className="avatar">NM</div><div><div className="workspace-user">Northstar Medical</div><div className="workspace-meta">Synthetic demo · v0.9</div></div></div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="topbar-leading">
            <button className="menu-button" aria-label="Open navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(true)}><Menu size={18} /></button>
            <div><div className="topbar-kicker">Northstar / Operations</div><div className="topbar-title">{title}</div></div>
          </div>
          <div className="top-actions">
            <span className="synthetic">SYNTHETIC DATA</span>
            <button className="icon-button" aria-label="Search"><Search size={15} /></button>
            <button className="icon-button has-notification" aria-label="Notifications"><Bell size={15} /><span /></button>
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
