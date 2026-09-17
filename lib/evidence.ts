export type EvidenceArtifactKind = "screenshot" | "document" | "structured_data" | "event_log" | "manifest";

export interface EvidenceArtifact {
  id: string;
  title: string;
  kind: EvidenceArtifactKind;
  description: string;
  capturedAt: string;
  mediaType: string;
  digest: string;
  source: string;
  availability: "synthetic_placeholder";
}

export interface EvidenceManifest {
  runId: string;
  algorithm: "SHA-256";
  generatedAt: string;
  digest: string;
  artifacts: EvidenceArtifact[];
}

export interface EvidenceReport {
  runId: string;
  workflow: string;
  workflowVersion: string;
  provider: string;
  payer: string;
  outcome: "completed";
  startedAt: string;
  completedAt: string;
  correlationId: string;
  synthetic: true;
  extracted: {
    enrollmentStatus: string;
    effectiveDate: string;
    reference: string;
    outstandingRequirements: string[];
  };
  actions: {
    id: string;
    timestamp: string;
    title: string;
    detail: string;
    outcome: "completed" | "changed";
  }[];
  semanticRecovery: {
    invoked: boolean;
    summary: string;
  };
  approval: {
    required: boolean;
    summary: string;
  };
  policyDecisions: {
    policy: string;
    decision: "allowed" | "not_required";
    rationale: string;
  }[];
  finalResult: {
    headline: string;
    summary: string;
    priorStatus: string;
    observedStatus: string;
  };
  manifest: EvidenceManifest;
}

const SHA256_PATTERN = /^(?:sha256:)?[a-f0-9]{64}$/i;

export function isSha256Digest(value: string): boolean {
  return SHA256_PATTERN.test(value);
}

export function validateEvidenceManifest(manifest: EvidenceManifest): string[] {
  const errors: string[] = [];
  if (!isSha256Digest(manifest.digest)) errors.push("Manifest digest must be a SHA-256 value.");
  if (manifest.artifacts.length === 0) errors.push("Manifest must contain at least one artifact.");

  const ids = new Set<string>();
  for (const artifact of manifest.artifacts) {
    if (ids.has(artifact.id)) errors.push(`Artifact ID "${artifact.id}" is duplicated.`);
    ids.add(artifact.id);
    if (!isSha256Digest(artifact.digest)) errors.push(`Artifact "${artifact.id}" has an invalid SHA-256 digest.`);
    if (artifact.availability !== "synthetic_placeholder") {
      errors.push(`Artifact "${artifact.id}" must be marked as a synthetic placeholder.`);
    }
  }
  return errors;
}

const artifacts: EvidenceArtifact[] = [
  {
    id: "ART-2841-01",
    title: "Enrollment search results",
    kind: "screenshot",
    description: "Synthetic visual placeholder for the payer portal result list used to locate the enrollment.",
    capturedAt: "Sep 17, 2026 · 9:42:18 AM",
    mediaType: "image/png",
    digest: "04b786cff2c891e4420e3b993d83d614f1fa6f9c8db826e601f7c1a4b325eb30",
    source: "Atlas synthetic portal · browser capture",
    availability: "synthetic_placeholder",
  },
  {
    id: "ART-2841-02",
    title: "Enrollment detail",
    kind: "screenshot",
    description: "Synthetic visual placeholder for the record view from which status and effective date were extracted.",
    capturedAt: "Sep 17, 2026 · 9:42:27 AM",
    mediaType: "image/png",
    digest: "8bf67c8f44a21ac6df867934530b07e8198b3f32d17a05186552317e985a6f41",
    source: "Atlas synthetic portal · browser capture",
    availability: "synthetic_placeholder",
  },
  {
    id: "ART-2841-03",
    title: "Extracted enrollment fields",
    kind: "structured_data",
    description: "Normalized synthetic status, date, reference, and outstanding-requirement fields.",
    capturedAt: "Sep 17, 2026 · 9:42:29 AM",
    mediaType: "application/json",
    digest: "23ce29384c9b7c52334497cfb74259372831b458894fed40f86660d58254c842",
    source: "Workflow extractor · enrollment schema v2",
    availability: "synthetic_placeholder",
  },
  {
    id: "ART-2841-04",
    title: "Prior snapshot comparison",
    kind: "document",
    description: "Synthetic document placeholder describing the Pending-to-Approved status comparison.",
    capturedAt: "Sep 17, 2026 · 9:42:32 AM",
    mediaType: "application/pdf",
    digest: "63fe086d457ac6968577793afe633e2a3eb70b72d3d78138e952f425dabafe7c",
    source: "PortalOps comparison step · generated summary",
    availability: "synthetic_placeholder",
  },
  {
    id: "ART-2841-05",
    title: "Chronological event log",
    kind: "event_log",
    description: "Structured synthetic events for navigation, extraction, comparison, policy, and sealing.",
    capturedAt: "Sep 17, 2026 · 9:42:36 AM",
    mediaType: "application/x-ndjson",
    digest: "a0c72049bc71b978d31f11f9cb35ec69f8ccf63f659529634f80bad24147d8f5",
    source: "PortalOps run event stream",
    availability: "synthetic_placeholder",
  },
  {
    id: "ART-2841-06",
    title: "Policy decision record",
    kind: "structured_data",
    description: "Synthetic decision metadata for host scope, read-only execution, and approval policy.",
    capturedAt: "Sep 17, 2026 · 9:42:36 AM",
    mediaType: "application/json",
    digest: "72c6fc54f9a982e608ed48602d5826941682ca82e69ce45b3538cc9ed92cedf1",
    source: "PortalOps policy evaluator",
    availability: "synthetic_placeholder",
  },
  {
    id: "ART-2841-07",
    title: "Final structured result",
    kind: "structured_data",
    description: "Synthetic completed outcome with the observed enrollment change.",
    capturedAt: "Sep 17, 2026 · 9:42:37 AM",
    mediaType: "application/json",
    digest: "d5b788999d3464358bdb407699434ff57a8d31c8d58e977043f09372e4ef1bc1",
    source: "PortalOps workflow result",
    availability: "synthetic_placeholder",
  },
  {
    id: "ART-2841-08",
    title: "Evidence manifest",
    kind: "manifest",
    description: "Synthetic content inventory and digest metadata for this demonstration report.",
    capturedAt: "Sep 17, 2026 · 9:42:38 AM",
    mediaType: "application/json",
    digest: "f480a9bb2549761433f0bfa10550175b226486ebc17a4a3fb763058b5df18ddf",
    source: "PortalOps evidence sealer · manifest schema v1",
    availability: "synthetic_placeholder",
  },
];

export const evidenceReports: EvidenceReport[] = [{
  runId: "RUN-2841",
  workflow: "Enrollment status check",
  workflowVersion: "v2.4",
  provider: "Northstar Medical Group",
  payer: "Atlas Health Plan",
  outcome: "completed",
  startedAt: "Sep 17, 2026 · 9:42:11 AM",
  completedAt: "Sep 17, 2026 · 9:42:38 AM",
  correlationId: "RUN-2841-NORTHSTAR",
  synthetic: true,
  extracted: {
    enrollmentStatus: "Approved",
    effectiveDate: "Oct 1, 2026",
    reference: "ATL-ENR-884219",
    outstandingRequirements: [],
  },
  actions: [
    { id: "EVT-01", timestamp: "9:42:11 AM", title: "Run initialized", detail: "Loaded enrollment status check v2.4 with a three-attempt budget.", outcome: "completed" },
    { id: "EVT-02", timestamp: "9:42:14 AM", title: "Approved portal opened", detail: "Navigated to the exact Atlas synthetic host after domain policy evaluation.", outcome: "completed" },
    { id: "EVT-03", timestamp: "9:42:21 AM", title: "Enrollment record located", detail: "Matched synthetic provider and enrollment reference ATL-ENR-884219.", outcome: "completed" },
    { id: "EVT-04", timestamp: "9:42:29 AM", title: "Enrollment facts extracted", detail: "Normalized status, effective date, reference, and outstanding requirements.", outcome: "completed" },
    { id: "EVT-05", timestamp: "9:42:32 AM", title: "Status change detected", detail: "Compared with the prior synthetic snapshot: Pending → Approved.", outcome: "changed" },
    { id: "EVT-06", timestamp: "9:42:38 AM", title: "Evidence manifest assembled", detail: "Recorded eight synthetic placeholder entries and digest metadata.", outcome: "completed" },
  ],
  semanticRecovery: {
    invoked: false,
    summary: "The primary visible labels resolved on the first attempt; semantic recovery was not invoked.",
  },
  approval: {
    required: false,
    summary: "No approval was requested because this workflow only read and compared portal information; it performed no external write or submission.",
  },
  policyDecisions: [
    { policy: "Portal host scope", decision: "allowed", rationale: "Target matched the configured Atlas synthetic host." },
    { policy: "Action boundary", decision: "allowed", rationale: "All actions were read, compare, or evidence operations." },
    { policy: "Human approval", decision: "not_required", rationale: "No consequential external side effect was proposed." },
  ],
  finalResult: {
    headline: "Enrollment status changed to Approved",
    summary: "The synthetic Atlas record was observed as Approved with an Oct 1, 2026 effective date and no outstanding requirements.",
    priorStatus: "Pending",
    observedStatus: "Approved",
  },
  manifest: {
    runId: "RUN-2841",
    algorithm: "SHA-256",
    generatedAt: "Sep 17, 2026 · 9:42:38 AM",
    digest: "3daeb96dc670ae13ea72b5b397e6fc41422f7138ee0768b75e4dc116213fd11a",
    artifacts,
  },
}];

export function getEvidenceReport(runId: string): EvidenceReport | undefined {
  return evidenceReports.find((report) => report.runId.toLowerCase() === runId.toLowerCase());
}
