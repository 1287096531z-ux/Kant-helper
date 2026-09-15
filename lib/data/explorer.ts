import { providerRegistry } from "@/lib/providers/registry";
import { issues, paths, philosopher, relations, scholars, terms, works } from "@/lib/data/seed";
import type {
  ExplorerPayload,
  GeoFlow,
  GeoNode,
  GraphEdge,
  GraphNode,
  GraphPayload,
  GraphScope,
  IssueBubble,
  IssueDetail,
  ProviderHealth,
  RefreshSnapshot,
  RelatedScholar,
  ResearchPathDetail,
  ResearchPathPreview,
  ScholarDetail,
  ScholarPreview,
  SepLink,
  TermDetail,
  TimelineEvent,
  WorkCitation,
  WorkDetail
} from "@/types/explorer";

const scholarMap = new Map(scholars.map((item) => [item.id, item]));
const issueMap = new Map(issues.map((item) => [item.id, item]));
const pathMap = new Map(paths.map((item) => [item.id, item]));
const termMap = new Map(terms.map((item) => [item.id, item]));
const workMap = new Map(works.map((item) => [item.id, item]));

function scholarPreview(id: string): ScholarPreview {
  const scholar = scholarMap.get(id);
  if (!scholar) {
    throw new Error(`Scholar not found: ${id}`);
  }

  const relatedCount = relations.filter((item) => item.source === id || item.target === id).length;

  return {
    id: scholar.id,
    slug: scholar.slug,
    name: scholar.name,
    nameZh: scholar.nameZh,
    region: scholar.region,
    institution: scholar.institution,
    eraFocus: scholar.eraFocus,
    summary: scholar.summary,
    tags: scholar.tags,
    workCount: scholar.workIds.length,
    relationCount: relatedCount
  };
}

function toWorkCitation(id: string): WorkCitation {
  const work = workMap.get(id);
  if (!work) {
    throw new Error(`Work not found: ${id}`);
  }

  return {
    id: work.id,
    title: work.title,
    titleZh: work.titleZh,
    year: work.year,
    venue: work.venue,
    doi: work.doi,
    cnkiId: work.cnkiId,
    source: work.source,
    citationCount: work.citationCount,
    authors: work.authors,
    abstract: work.abstract,
    argumentOutline: buildWorkOutline(work),
    url: work.url,
    keywords: work.keywords,
    relatedScholarIds: work.scholarIds
  };
}

function buildTimeline(workIds: string[]): TimelineEvent[] {
  const years = new Map<number, { works: number; scholarIds: Set<string>; authorCounts: Map<string, number> }>();
  for (const id of workIds) {
    const work = workMap.get(id);
    if (!work) continue;
    const bucket = years.get(work.year) ?? { works: 0, scholarIds: new Set<string>(), authorCounts: new Map<string, number>() };
    bucket.works += 1;
    work.scholarIds.forEach((scholarId) => {
      bucket.scholarIds.add(scholarId);
      bucket.authorCounts.set(scholarId, (bucket.authorCounts.get(scholarId) ?? 0) + 1);
    });
    years.set(work.year, bucket);
  }

  return [...years.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([year, bucket]) => ({
      year,
      works: bucket.works,
      scholars: bucket.scholarIds.size,
      label: `${year}`,
      authors: [...bucket.authorCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([scholarId]) => {
          const scholar = scholarMap.get(scholarId);
          return {
            id: scholarId,
            name: scholar?.nameZh ?? scholar?.name ?? scholarId
          };
        })
    }));
}

function buildWorkOutline(work: (typeof works)[number]) {
  const termLabels = work.termIds
    .map((termId) => termMap.get(termId)?.label)
    .filter((label): label is string => Boolean(label));
  const cleanAbstract = (work.abstract ?? "").replace(/[。；]$/, "");
  const readableKeywords = work.keywords.slice(0, 3).map((keyword) => keyword.replace(/-/g, " "));
  const primaryTerms = termLabels.slice(0, 2);

  return [
    {
      label: "问题",
      detail: `文章把论题收束到 ${primaryTerms.join("、") || "康德研究核心概念"} 上，先要回答“${cleanAbstract || "这篇论文如何重新界定核心问题"}”。`
    },
    {
      label: "主张",
      detail: cleanAbstract ? `摘要中的中心判断是：${cleanAbstract}。作者不是先给背景综述，而是直接把自己的解释性判断推到前台。` : "摘要直接提出作者的解释性判断，并把争论焦点集中到单一命题上。"
    },
    {
      label: "推进",
      detail: `论证推进通常沿着 ${readableKeywords.join(" -> ") || "文本解释 -> 概念分析 -> 论证重构"} 这条线展开：先界定概念，再重排论证关系，最后回到问题本身检验解释是否成立。`
    },
    {
      label: "落点",
      detail: `文章最后的落点不是停在背景介绍，而是要说明 ${primaryTerms[0] ?? "该问题"} 如何在 ${work.venue} 这一语境中获得新的解释位置，并由此影响后续康德研究。`
    }
  ];
}

function buildGeo(primaryScholarIds: string[], includeSecondary = false): { nodes: GeoNode[]; flows: GeoFlow[] } {
  const primaryIds = [...new Set(primaryScholarIds)];
  const secondaryIds = includeSecondary
    ? [
        ...new Set(
          relations.flatMap((item) => {
            if (primaryIds.includes(item.source) && !primaryIds.includes(item.target)) {
              return [item.target];
            }
            if (primaryIds.includes(item.target) && !primaryIds.includes(item.source)) {
              return [item.source];
            }
            return [];
          })
        )
      ]
    : [];
  const allIds = [...new Set([...primaryIds, ...secondaryIds])];

  const nodes = allIds
    .map((id) => scholarMap.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map((scholar): GeoNode => ({
      id: scholar.id,
      label: scholar.nameZh ?? scholar.name,
      region: scholar.region,
      institution: scholar.institution,
      x: scholar.geo.x,
      y: scholar.geo.y,
      strength: scholar.workIds.filter((workId) => workMap.has(workId)).length,
      level: primaryIds.includes(scholar.id) ? "primary" : "secondary"
    }));

  const flows: GeoFlow[] = relations
    .filter((item) => allIds.includes(item.source) && allIds.includes(item.target))
    .map((item) => ({
      source: item.source,
      target: item.target,
      intensity: item.type === "coauthored_with" ? 0.95 : 0.72,
      label: item.summary
    }));

  return { nodes, flows };
}

function pathPreview(id: string): ResearchPathPreview {
  const path = pathMap.get(id);
  if (!path) {
    throw new Error(`Path not found: ${id}`);
  }

  const pathWorks = new Set(path.scholarIds.flatMap((scholarId) => scholarMap.get(scholarId)?.workIds ?? []));

  return {
    id: path.id,
    label: path.label,
    summary: path.summary,
    stance: path.stance,
    scholarCount: path.scholarIds.length,
    workCount: pathWorks.size
  };
}

export function getPhilosophers() {
  return [philosopher];
}

export function getExplorerPayload(): ExplorerPayload {
  const issueBubbles: IssueBubble[] = issues.map((issue) => {
    const issuePaths = paths.filter((path) => path.issueId === issue.id);
    const scholarIds = issuePaths.flatMap((path) => path.scholarIds);
    const workIds = [...new Set(scholarIds.flatMap((scholarId) => scholarMap.get(scholarId)?.workIds ?? []))];
    const yearValues = workIds.map((workId) => workMap.get(workId)?.year).filter((year): year is number => typeof year === "number");

    return {
      id: issue.id,
      label: issue.label,
      title: issue.title,
      summary: issue.summary,
      weight: issue.weight,
      documentCount: workIds.length,
      pathCount: issuePaths.length,
      termIds: issue.termIds,
      yearSpan: {
        start: yearValues.length ? Math.min(...yearValues) : 1980,
        end: yearValues.length ? Math.max(...yearValues) : 2025
      }
    };
  });

  return {
    philosopher,
    defaultRange: [1980, 2025],
    issues: issueBubbles,
    metrics: {
      scholars: scholars.length,
      works: works.length,
      terms: terms.length,
      regions: new Set(scholars.map((item) => item.region)).size,
      cnkiWorks: works.filter((item) => item.source === "cnki" || Boolean(item.cnkiId)).length
    },
    sourceRecords: [
      { provider: "curated", status: "ready", note: "问题、进路、人物关系由策展数据维护。" },
      { provider: "cnki", status: "fallback", note: "CNKI 为受限实时层，首版以缓存与手工补录兜底。" },
      { provider: "openalex", status: "fallback", note: "OpenAlex 接口已预留，当前由种子数据模拟刷新结果。" },
      { provider: "crossref", status: "fallback", note: "Crossref 用于 DOI 与期刊补全，首版保留接入位。" }
    ]
  };
}

export function getIssueDetail(id: string): IssueDetail {
  const issue = issueMap.get(id);
  if (!issue) {
    throw new Error(`Issue not found: ${id}`);
  }

  const detailPaths: ResearchPathDetail[] = paths
    .filter((path) => path.issueId === issue.id)
    .map((path) => ({
      ...pathPreview(path.id),
      scholars: path.scholarIds.map(scholarPreview),
      highlights: path.highlights
    }));

  const scholarIds = [...new Set(detailPaths.flatMap((path) => path.scholars.map((scholar) => scholar.id)))];
  const workIds = [...new Set(scholarIds.flatMap((scholarId) => scholarMap.get(scholarId)?.workIds ?? []))];

  return {
    id: issue.id,
    label: issue.label,
    title: issue.title,
    summary: issue.summary,
    paths: detailPaths,
    terms: issue.termIds.map((termId) => termMap.get(termId)).filter((term): term is NonNullable<typeof term> => Boolean(term)),
    timeline: buildTimeline(workIds),
    geo: buildGeo(scholarIds, true)
  };
}

export function getRelatedScholars(id: string): RelatedScholar[] {
  return relations
    .filter((item) => item.source === id || item.target === id)
    .map((item) => {
      const relatedId = item.source === id ? item.target : item.source;
      const scholar = scholarMap.get(relatedId);
      if (!scholar) {
        throw new Error(`Related scholar not found: ${relatedId}`);
      }
      return {
        id: scholar.id,
        name: scholar.nameZh ?? scholar.name,
        relation: item.type,
        summary: item.summary,
        institution: scholar.institution,
        region: scholar.region,
        workCount: scholar.workIds.filter((workId) => workMap.has(workId)).length
      };
    });
}

export function getBranchScholars(id: string): RelatedScholar[] {
  const directRelated = new Set(getRelatedScholars(id).map((item) => item.id));
  const branchEntries: RelatedScholar[] = [];

  relations
    .filter((item) => item.target === id && item.type !== "coauthored_with")
    .forEach((item) => {
      const scholar = scholarMap.get(item.source);
      if (!scholar) {
        throw new Error(`Branch scholar not found: ${item.source}`);
      }
      branchEntries.push({
        id: scholar.id,
        name: scholar.nameZh ?? scholar.name,
        relation: item.type,
        summary: item.summary,
        institution: scholar.institution,
        region: scholar.region,
        workCount: scholar.workIds.filter((workId) => workMap.has(workId)).length
      });
    });

  const pathCohort = scholarMap.get(id)?.pathIds.flatMap((pathId) => pathMap.get(pathId)?.scholarIds ?? []) ?? [];
  pathCohort.forEach((scholarId) => {
    if (scholarId === id || directRelated.has(scholarId) || branchEntries.some((item) => item.id === scholarId)) {
      return;
    }
    const scholar = scholarMap.get(scholarId);
    if (!scholar) {
      return;
    }
    branchEntries.push({
      id: scholar.id,
      name: scholar.nameZh ?? scholar.name,
      relation: "influenced_by",
      summary: "与当前学者共享同一研究进路，可视作扩展分支中的关键节点。",
      institution: scholar.institution,
      region: scholar.region,
      workCount: scholar.workIds.filter((workId) => workMap.has(workId)).length
    });
  });

  return dedupeById(branchEntries);
}

export function getScholarDetail(id: string): ScholarDetail {
  const scholar = scholarMap.get(id);
  if (!scholar) {
    throw new Error(`Scholar not found: ${id}`);
  }

  const validWorkIds = scholar.workIds.filter((workId) => workMap.has(workId));
  const relatedScholars = getRelatedScholars(id);
  const branchScholars = getBranchScholars(id);

  return {
    ...scholarPreview(id),
    biography: scholar.biography,
    terms: scholar.termIds.map((termId) => termMap.get(termId)).filter((term): term is NonNullable<typeof term> => Boolean(term)),
    issues: scholar.issueIds.map((issueId) => {
      const issue = issueMap.get(issueId);
      if (!issue) throw new Error(`Issue not found: ${issueId}`);
      return { id: issue.id, label: issue.label, title: issue.title };
    }),
    paths: scholar.pathIds.map(pathPreview),
    works: validWorkIds.map(toWorkCitation).sort((a, b) => b.year - a.year),
    relatedScholars,
    branchScholars,
    timeline: buildTimeline(validWorkIds),
    geo: buildGeo([id, ...relatedScholars.map((item) => item.id), ...branchScholars.map((item) => item.id)], true)
  };
}

export function getTermDetail(id: string): TermDetail {
  const term = termMap.get(id);
  if (!term) {
    throw new Error(`Term not found: ${id}`);
  }

  const relatedIssueIds = issues.filter((issue) => issue.termIds.includes(id)).map((issue) => issue.id);
  const relatedScholarIds = scholars.filter((scholar) => scholar.termIds.includes(id)).map((scholar) => scholar.id);
  const relatedWorkCount = works.filter((work) => work.termIds.includes(id)).length;

  return {
    ...term,
    relatedIssues: relatedIssueIds.map((issueId) => {
      const issue = issueMap.get(issueId);
      if (!issue) {
        throw new Error(`Issue not found: ${issueId}`);
      }
      return { id: issue.id, label: issue.label, title: issue.title };
    }),
    relatedScholars: relatedScholarIds.map((scholarId) => {
      const scholar = scholarMap.get(scholarId);
      if (!scholar) {
        throw new Error(`Scholar not found: ${scholarId}`);
      }
      return {
        id: scholar.id,
        name: scholar.name,
        nameZh: scholar.nameZh,
        institution: scholar.institution,
        region: scholar.region
      };
    }),
    relatedWorkCount
  };
}

export function getWorkDetail(id: string): WorkDetail {
  const work = workMap.get(id);
  if (!work) {
    throw new Error(`Work not found: ${id}`);
  }
  return {
    ...toWorkCitation(id),
    relatedTerms: work.termIds.map((termId) => termMap.get(termId)).filter((term): term is NonNullable<typeof term> => Boolean(term)),
    relatedScholars: work.scholarIds.map(scholarPreview)
  };
}

export function getGraph(scope: GraphScope, id: string): GraphPayload {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  if (scope === "philosopher") {
    issues.forEach((issue) => nodes.push({ id: issue.id, label: issue.label, type: "issue", strength: issue.weight / 10, meta: issue.title }));
    paths.forEach((path) => {
      nodes.push({ id: path.id, label: path.label, type: "path", strength: path.scholarIds.length + 2, meta: path.stance });
      edges.push({ id: `${path.id}-${path.issueId}`, source: path.id, target: path.issueId, type: "belongs_to", label: "属于问题" });
    });
  }

  const attachScholarCluster = (scholarIds: string[]) => {
    scholarIds.forEach((scholarId) => {
      const scholar = scholarMap.get(scholarId);
      if (!scholar) return;
      nodes.push({ id: scholar.id, label: scholar.nameZh ?? scholar.name, type: "scholar", strength: scholar.workIds.length + 3, meta: scholar.institution });
      scholar.workIds.forEach((workId) => {
        const work = workMap.get(workId);
        if (!work) return;
        nodes.push({ id: work.id, label: work.titleZh ?? work.title, type: "work", strength: Math.max(2, Math.round(work.citationCount / 200)), meta: `${work.year} · ${work.venue}` });
        edges.push({ id: `${scholar.id}-${work.id}`, source: scholar.id, target: work.id, type: "authored", label: "代表论文" });
      });
      scholar.termIds.forEach((termId) => {
        const term = termMap.get(termId);
        if (!term) return;
        nodes.push({ id: term.id, label: term.label, type: "term", strength: 3, meta: term.sep?.title });
        edges.push({ id: `${scholar.id}-${term.id}`, source: scholar.id, target: term.id, type: "related_to_sep", label: "相关术语" });
      });
    });
  };

  if (scope === "issue") {
    const issue = getIssueDetail(id);
    nodes.push({ id: issue.id, label: issue.label, type: "issue", strength: 10, meta: issue.title });
    issue.terms.forEach((term) => {
      nodes.push({ id: term.id, label: term.label, type: "term", strength: 4, meta: term.sep?.title });
      edges.push({ id: `${issue.id}-${term.id}-core`, source: issue.id, target: term.id, type: "mentions_term", label: "核心概念" });
    });
    issue.paths.forEach((path) => {
      nodes.push({ id: path.id, label: path.label, type: "path", strength: path.scholarCount + 2, meta: path.stance });
      edges.push({ id: `${path.id}-${issue.id}`, source: path.id, target: issue.id, type: "belongs_to", label: "属于问题" });
      path.scholars.forEach((scholar) => {
        edges.push({ id: `${path.id}-${scholar.id}-scholar`, source: path.id, target: scholar.id, type: "focuses_on", label: "代表学者" });
      });
    });
    attachScholarCluster(issue.paths.flatMap((path) => path.scholars.map((scholar) => scholar.id)));
  }

  if (scope === "scholar") {
    const scholar = getScholarDetail(id);
    nodes.push({ id: scholar.id, label: scholar.nameZh ?? scholar.name, type: "scholar", strength: 10, meta: scholar.institution });
    scholar.paths.forEach((path) => {
      nodes.push({ id: path.id, label: path.label, type: "path", strength: path.scholarCount + 2, meta: path.stance });
      edges.push({ id: `${scholar.id}-${path.id}`, source: scholar.id, target: path.id, type: "focuses_on", label: "研究进路" });
    });
    attachScholarCluster([scholar.id, ...scholar.relatedScholars.map((item) => item.id), ...scholar.branchScholars.map((item) => item.id)]);
    scholar.relatedScholars.forEach((item) => {
      edges.push({ id: `${scholar.id}-${item.id}-${item.relation}`, source: scholar.id, target: item.id, type: item.relation, label: item.summary });
    });
    scholar.branchScholars.forEach((item) => {
      edges.push({ id: `${item.id}-${scholar.id}-branch-${item.relation}`, source: item.id, target: scholar.id, type: item.relation, label: item.summary });
    });
  }

  if (scope === "work") {
    const work = getWorkDetail(id);
    nodes.push({ id: work.id, label: work.titleZh ?? work.title, type: "work", strength: 9, meta: `${work.year} · ${work.venue}` });
    work.relatedScholars.forEach((scholar) => {
      nodes.push({ id: scholar.id, label: scholar.nameZh ?? scholar.name, type: "scholar", strength: scholar.workCount + 2, meta: scholar.institution });
      edges.push({ id: `${scholar.id}-${work.id}`, source: scholar.id, target: work.id, type: "authored", label: "作者" });
    });
    work.relatedTerms.forEach((term) => {
      nodes.push({ id: term.id, label: term.label, type: "term", strength: 3, meta: term.sep?.title });
      edges.push({ id: `${work.id}-${term.id}`, source: work.id, target: term.id, type: "mentions_term", label: "相关术语" });
    });
  }

  return {
    scope,
    id,
    nodes: dedupeById(nodes),
    edges: dedupeById(edges)
  };
}

function dedupeById<T extends { id: string }>(items: T[]) {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

export function getTimeline(scope: "issue" | "scholar", id: string) {
  return scope === "issue" ? getIssueDetail(id).timeline : getScholarDetail(id).timeline;
}

export function getGeo(scope: "issue" | "scholar", id: string) {
  return scope === "issue" ? getIssueDetail(id).geo : getScholarDetail(id).geo;
}

export async function refreshScope(scope: "issue" | "scholar" | "work", id: string): Promise<RefreshSnapshot> {
  const label =
    scope === "issue"
      ? issueMap.get(id)?.label
      : scope === "scholar"
        ? scholarMap.get(id)?.name
        : workMap.get(id)?.title;

  const query = scope === "issue" ? { issue: label } : scope === "scholar" ? { scholarName: label } : { workTitle: label };
  const providerHealth: ProviderHealth[] = [];

  for (const provider of providerRegistry) {
    const result = await provider.query(query);
    providerHealth.push(result.health);
  }

  return {
    scope,
    id,
    providerHealth,
    updatedAt: new Date().toISOString(),
    mergedWorks: scope === "scholar" ? scholarMap.get(id)?.workIds.length ?? 0 : scope === "issue" ? getIssueDetail(id).timeline.reduce((sum, item) => sum + item.works, 0) : 1,
    usedFallback: true
  };
}

export function resolveSep(term: string): SepLink | null {
  const matchTerm = terms.find((item) => item.label === term || item.sep?.title === term);
  if (matchTerm?.sep) {
    return matchTerm.sep;
  }

  const matchScholar = scholars.find((item) => item.name === term || item.nameZh === term);
  return matchScholar?.sep ?? null;
}
