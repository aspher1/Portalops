import { describe, expect, it } from "vitest";
import { evidenceReports, isSha256Digest, validateEvidenceManifest } from "@/lib/evidence";

describe("evidence digest validation", () => {
  it("accepts bare and prefixed SHA-256 digest formats", () => {
    const digest = "04b786cff2c891e4420e3b993d83d614f1fa6f9c8db826e601f7c1a4b325eb30";
    expect(isSha256Digest(digest)).toBe(true);
    expect(isSha256Digest(`sha256:${digest}`)).toBe(true);
  });

  it("rejects truncated and non-hex values", () => {
    expect(isSha256Digest("abc123")).toBe(false);
    expect(isSha256Digest("z".repeat(64))).toBe(false);
  });
});

describe("evidence manifest validation", () => {
  it("accepts the RUN-2841 synthetic manifest", () => {
    expect(validateEvidenceManifest(evidenceReports[0].manifest)).toEqual([]);
  });

  it("reports malformed digests and duplicate artifact IDs", () => {
    const manifest = structuredClone(evidenceReports[0].manifest);
    manifest.digest = "invalid";
    manifest.artifacts[1].id = manifest.artifacts[0].id;
    manifest.artifacts[1].digest = "short";

    expect(validateEvidenceManifest(manifest)).toEqual([
      "Manifest digest must be a SHA-256 value.",
      `Artifact ID "${manifest.artifacts[0].id}" is duplicated.`,
      `Artifact "${manifest.artifacts[0].id}" has an invalid SHA-256 digest.`,
    ]);
  });
});
