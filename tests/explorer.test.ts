import { describe, expect, it } from "vitest";
import { getExplorerPayload, getIssueDetail, getScholarDetail, resolveSep } from "@/lib/data/explorer";
import { scholars } from "@/lib/data/seed";

describe("explorer data", () => {
  it("builds the issue cloud payload", () => {
    const payload = getExplorerPayload();
    expect(payload.philosopher.slug).toBe("kant");
    expect(payload.issues).toHaveLength(6);
    expect(payload.issues[0]?.yearSpan.start).toBeGreaterThanOrEqual(1980);
  });

  it("returns issue detail with research paths", () => {
    const issue = getIssueDetail("issue-ti");
    expect(issue.paths.length).toBeGreaterThan(1);
    expect(issue.timeline.length).toBeGreaterThan(0);
    expect(issue.timeline[0]?.authors.length).toBeGreaterThan(0);
  });

  it("returns scholar detail with related people", () => {
    const scholar = getScholarDetail("sch-oneill");
    expect(scholar.relatedScholars.some((item) => item.id === "sch-wood")).toBe(true);
    expect(scholar.works[0]?.argumentOutline.length).toBeGreaterThan(0);
    expect(scholar.works[0]?.argumentOutline[0]?.label).toBe("问题");
  });

  it("resolves every scholar detail in the curated dataset", () => {
    for (const scholarSeed of scholars) {
      const scholar = getScholarDetail(scholarSeed.id);
      expect(scholar.id).toBe(scholarSeed.id);
      expect(Array.isArray(scholar.works)).toBe(true);
      expect(Array.isArray(scholar.branchScholars)).toBe(true);
    }
  });

  it("resolves SEP links for terms", () => {
    const sep = resolveSep("先验唯心论");
    expect(sep?.url).toContain("stanford.edu");
  });
});
