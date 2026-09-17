import Link from "next/link";
import { ArrowRight, CheckCircle2, FileArchive, Fingerprint, ShieldCheck } from "lucide-react";
import { evidenceReports } from "@/lib/evidence";

export function EvidenceIndex() {
  return (
    <>
      <div className="page-head evidence-index-head">
        <div>
          <div className="page-overline">PortalOps / Evidence</div>
          <h1>Evidence reports</h1>
          <p className="subtle">Inspect synthetic run facts, actions, policy decisions, and artifact provenance in one review surface.</p>
        </div>
        <span className="synthetic">Synthetic demo data</span>
      </div>

      <div className="evidence-assurance" aria-label="Evidence report characteristics">
        <div><FileArchive size={16} /><span><strong>Run-linked</strong>Operational facts stay attached to the source run.</span></div>
        <div><Fingerprint size={16} /><span><strong>Digest metadata</strong>SHA-256-style identifiers support content-addressed design.</span></div>
        <div><ShieldCheck size={16} /><span><strong>Claim-aware</strong>Demo metadata is not a compliance assertion or stored proof.</span></div>
      </div>

      <section className="card evidence-list-card" aria-labelledby="available-reports">
        <div className="card-head">
          <div><div className="card-label">Report index</div><h2 id="available-reports">Available reports</h2></div>
          <span className="meta">{evidenceReports.length} synthetic report</span>
        </div>
        <div className="evidence-report-list">
          {evidenceReports.map((report) => (
            <article className="evidence-report-row" key={report.runId}>
              <div className="evidence-report-mark"><CheckCircle2 size={18} /></div>
              <div>
                <div className="evidence-report-title">
                  <Link href={`/evidence/${report.runId}`}>{report.runId}</Link>
                  <span className="pill completed"><span className="dot" />{report.outcome}</span>
                </div>
                <strong>{report.workflow}</strong>
                <p>{report.provider} · {report.payer}</p>
              </div>
              <dl>
                <div><dt>Observed result</dt><dd>{report.extracted.enrollmentStatus} · {report.extracted.effectiveDate}</dd></div>
                <div><dt>Completed</dt><dd>{report.completedAt}</dd></div>
                <div><dt>Contents</dt><dd>{report.manifest.artifacts.length} synthetic placeholder entries</dd></div>
              </dl>
              <Link className="button" href={`/evidence/${report.runId}`}>Open report <ArrowRight size={12} /></Link>
            </article>
          ))}
        </div>
      </section>

      <p className="evidence-disclaimer">
        This index is a product demonstration. It does not load persisted artifacts, establish chain of custody, or make a compliance claim.
      </p>
    </>
  );
}
