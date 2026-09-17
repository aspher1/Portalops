import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Clock3, FileArchive, Globe2, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { runs } from "@/lib/demo-data";

export default async function RunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const run = runs.find((item) => item.id.toLowerCase() === decodeURIComponent(id).toLowerCase());
  if (!run) notFound();

  return (
    <AppShell title={`${run.id} · ${run.workflow}`}>
      <div className="content">
        <Link className="text-link run-back" href="/runs"><ArrowLeft size={13} /> Execution history</Link>
        <div className="page-head run-detail-head">
          <div>
            <div className="page-overline"><span className="live-signal" /> Run record / {run.id}</div>
            <h1>{run.workflow}</h1>
            <p className="subtle">{run.provider} · {run.payer}</p>
          </div>
          <span className={`pill ${run.status}`}><span className="dot" />{run.status.replaceAll("_", " ")}</span>
        </div>

        <div className="run-summary">
          <div className="card run-stat"><Clock3 size={15} /><span>Started</span><strong>{run.startedAt}</strong></div>
          <div className="card run-stat"><Globe2 size={15} /><span>Target system</span><strong>{run.payer}</strong></div>
          <div className="card run-stat"><ShieldCheck size={15} /><span>Execution policy</span><strong>Bounded · supervised</strong></div>
          <div className="card run-stat"><FileArchive size={15} /><span>Evidence state</span><strong>{run.status === "completed" ? "Bundle sealed" : "Capture in progress"}</strong></div>
        </div>

        <div className="run-detail-grid">
          <section className="card">
            <div className="card-head"><div><div className="card-label">Execution timeline</div><h2>Operational activity</h2></div><span className="meta">{run.progress}% complete</span></div>
            <div className="run-timeline">
              {(run.steps.length ? run.steps : [
                { id: "queued", label: "Workflow initialized", kind: "navigate" as const, status: run.status === "running" ? "running" as const : "completed" as const, destructive: false, attempts: 1 },
              ]).map((step, index) => (
                <div className={`timeline-event ${step.status}`} key={step.id}>
                  <div className="timeline-marker">{step.status === "completed" ? <Check size={12} /> : index + 1}</div>
                  <div><strong>{step.label}</strong><span>{step.kind} · {step.attempts} attempt{step.attempts === 1 ? "" : "s"}</span></div>
                  <span className={`pill ${step.status}`}>{step.status}</span>
                </div>
              ))}
            </div>
          </section>

          <aside className="card run-evidence">
            <div className="card-head"><div><div className="card-label">Evidence & result</div><h2>Inspectable output</h2></div></div>
            <dl className="run-facts">
              <div><dt>Correlation ID</dt><dd>{run.id}-NORTHSTAR</dd></div>
              <div><dt>Provider</dt><dd>{run.provider}</dd></div>
              <div><dt>Portal</dt><dd>{run.payer}</dd></div>
              <div><dt>Automation boundary</dt><dd>{run.status === "needs_approval" ? "Submission paused" : "Policy checks passed"}</dd></div>
            </dl>
            <Link className="button" href="/evidence"><FileArchive size={13} /> Open evidence workspace</Link>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
