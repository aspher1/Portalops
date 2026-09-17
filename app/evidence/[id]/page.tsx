import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Check, CheckCircle2, Clock3, FileArchive, FileJson2, FileText, Fingerprint,
  Globe2, ImageIcon, Info, LockKeyhole, ShieldCheck, UserRound,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { getEvidenceReport, validateEvidenceManifest, type EvidenceArtifactKind } from "@/lib/evidence";

function ArtifactIcon({ kind }: { kind: EvidenceArtifactKind }) {
  if (kind === "screenshot") return <ImageIcon size={17} />;
  if (kind === "document") return <FileText size={17} />;
  if (kind === "manifest") return <Fingerprint size={17} />;
  return <FileJson2 size={17} />;
}

export default async function EvidenceReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = getEvidenceReport(decodeURIComponent(id));
  if (!report) notFound();
  const manifestErrors = validateEvidenceManifest(report.manifest);

  return (
    <AppShell title={`${report.runId} · Evidence report`}>
      <div className="content evidence-content">
        <Link className="text-link run-back" href="/evidence"><ArrowLeft size={13} /> Evidence reports</Link>

        <header className="evidence-hero">
          <div>
            <div className="eyebrow">Synthetic evidence report / {report.runId}</div>
            <h1>{report.finalResult.headline}</h1>
            <p>{report.workflow} for {report.provider} at {report.payer}.</p>
            <div className="evidence-hero-tags">
              <span className="pill completed"><span className="dot" />{report.outcome}</span>
              <span className="synthetic">Synthetic demo data</span>
            </div>
          </div>
          <div className="evidence-export">
            <button className="button" type="button" disabled aria-describedby="export-note">
              <FileArchive size={13} /> Export demo bundle
            </button>
            <span id="export-note">Demo only · export and persistence are not implemented.</span>
          </div>
        </header>

        <section className="evidence-identity" aria-label="Run identity">
          <div><Clock3 size={15} /><span>Started</span><strong>{report.startedAt}</strong><small>Completed {report.completedAt}</small></div>
          <div><UserRound size={15} /><span>Provider</span><strong>{report.provider}</strong><small>Workflow {report.workflowVersion}</small></div>
          <div><Globe2 size={15} /><span>Payer</span><strong>{report.payer}</strong><small>Approved synthetic portal</small></div>
          <div><Fingerprint size={15} /><span>Correlation ID</span><strong className="mono">{report.correlationId}</strong><small>Run-linked identifier</small></div>
        </section>

        <div className="evidence-layout">
          <main className="evidence-main">
            <section className="card evidence-section" aria-labelledby="observed-facts">
              <div className="card-head">
                <div><div className="card-label">Extracted record</div><h2 id="observed-facts">Observed enrollment facts</h2></div>
                <span className="pill completed"><Check size={10} /> extracted</span>
              </div>
              <dl className="evidence-facts">
                <div><dt>Enrollment status</dt><dd>{report.extracted.enrollmentStatus}</dd></div>
                <div><dt>Effective date</dt><dd>{report.extracted.effectiveDate}</dd></div>
                <div><dt>Enrollment reference</dt><dd className="mono">{report.extracted.reference}</dd></div>
                <div><dt>Outstanding requirements</dt><dd>{report.extracted.outstandingRequirements.length ? report.extracted.outstandingRequirements.join(", ") : "None observed"}</dd></div>
              </dl>
              <p className="evidence-context"><Info size={14} /> These values are synthetic observations from the demo record. Portal content is treated as evidence, not authority.</p>
            </section>

            <section className="card evidence-section" aria-labelledby="action-history">
              <div className="card-head">
                <div><div className="card-label">Execution history</div><h2 id="action-history">Chronological actions</h2></div>
                <span className="meta">{report.actions.length} recorded events</span>
              </div>
              <ol className="evidence-timeline">
                {report.actions.map((action, index) => (
                  <li key={action.id}>
                    <div className={`evidence-event-marker ${action.outcome}`}><span>{index + 1}</span></div>
                    <div><time>{action.timestamp}</time><strong>{action.title}</strong><p>{action.detail}</p></div>
                    <span className={`pill ${action.outcome === "changed" ? "pending" : "completed"}`}>{action.outcome}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="card evidence-section" aria-labelledby="artifacts">
              <div className="card-head">
                <div><div className="card-label">Manifest contents</div><h2 id="artifacts">Artifact provenance</h2></div>
                <span className="meta">{report.manifest.artifacts.length} placeholder entries</span>
              </div>
              <div className="artifact-grid">
                {report.manifest.artifacts.map((artifact) => (
                  <article className="artifact-card" key={artifact.id}>
                    <div className="artifact-preview" aria-hidden="true">
                      <ArtifactIcon kind={artifact.kind} />
                      <span>{artifact.kind.replaceAll("_", " ")}</span>
                    </div>
                    <div className="artifact-body">
                      <div className="artifact-title"><h3>{artifact.title}</h3><span className="synthetic">Placeholder</span></div>
                      <p>{artifact.description}</p>
                      <dl>
                        <div><dt>Entry</dt><dd>{artifact.id} · {artifact.mediaType}</dd></div>
                        <div><dt>Captured</dt><dd>{artifact.capturedAt}</dd></div>
                        <div><dt>Source</dt><dd>{artifact.source}</dd></div>
                        <div><dt>SHA-256 metadata</dt><dd><code>{artifact.digest}</code></dd></div>
                      </dl>
                      <span className="artifact-unavailable"><LockKeyhole size={11} /> No binary file is attached in this demo</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </main>

          <aside className="evidence-rail">
            <section className="card evidence-section" aria-labelledby="result-summary">
              <div className="card-head"><div><div className="card-label">Final result</div><h2 id="result-summary">Completed observation</h2></div></div>
              <div className="evidence-result">
                <CheckCircle2 size={24} />
                <strong>{report.finalResult.priorStatus} → {report.finalResult.observedStatus}</strong>
                <p>{report.finalResult.summary}</p>
              </div>
            </section>

            <section className="card evidence-section" aria-labelledby="policy-history">
              <div className="card-head"><div><div className="card-label">Control record</div><h2 id="policy-history">Policy decisions</h2></div></div>
              <div className="policy-list">
                {report.policyDecisions.map((decision) => (
                  <div key={decision.policy}>
                    <ShieldCheck size={14} />
                    <span><strong>{decision.policy}</strong><small>{decision.rationale}</small></span>
                    <span className={`pill ${decision.decision === "allowed" ? "completed" : "running"}`}>{decision.decision.replaceAll("_", " ")}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="card evidence-section" aria-labelledby="recovery-approval">
              <div className="card-head"><div><div className="card-label">Supervision</div><h2 id="recovery-approval">Recovery & approval</h2></div></div>
              <dl className="evidence-rail-facts">
                <div><dt>Semantic recovery</dt><dd>{report.semanticRecovery.invoked ? "Invoked" : "Not invoked"}</dd><small>{report.semanticRecovery.summary}</small></div>
                <div><dt>Approval history</dt><dd>{report.approval.required ? "Approval required" : "No approval required"}</dd><small>{report.approval.summary}</small></div>
              </dl>
            </section>

            <section className="card manifest-card" aria-labelledby="manifest">
              <div className="manifest-heading">
                <Fingerprint size={19} />
                <div><div className="card-label">Evidence manifest</div><h2 id="manifest">Provenance metadata</h2></div>
              </div>
              <dl>
                <div><dt>Algorithm label</dt><dd>{report.manifest.algorithm}</dd></div>
                <div><dt>Generated</dt><dd>{report.manifest.generatedAt}</dd></div>
                <div><dt>Format check</dt><dd>{manifestErrors.length === 0 ? "Digest fields are well-formed" : "Metadata format issue"}</dd></div>
                <div><dt>Manifest digest</dt><dd><code>{report.manifest.digest}</code></dd></div>
              </dl>
              <p>These demo digest strings illustrate the intended metadata shape. This page does not fetch files or cryptographically verify content.</p>
            </section>

            <Link className="button evidence-run-link" href={`/runs/${report.runId}`}><ArrowLeft size={12} /> Return to source run</Link>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
