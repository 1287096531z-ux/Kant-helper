export type RelationType =
  | "advised_by"
  | "influenced_by"
  | "coauthored_with";

export type GraphScope = "philosopher" | "issue" | "scholar" | "work";

export type GraphNodeType =
  | "issue"
  | "path"
  | "scholar"
  | "work"
  | "term";

export type GraphEdgeType =
  | "belongs_to"
  | "focuses_on"
  | "authored"
  | "advised_by"
  | "influenced_by"
  | "coauthored_with"
  | "mentions_term"
  | "related_to_sep";

export type SourceName = "curated" | "cnki" | "openalex" | "crossref" | "cache";

export interface PhilosopherSummary {
  id: string;
  slug: string;
  name: string;
  label: string;
  lifespan: string;
  era: string;
  overview: string;
}

export interface SepLink {
  slug: string;
  title: string;
  url: string;
  summary: string;
}

export interface ConceptTerm {
  id: string;
  label: string;
  gloss: string;
  sep: SepLink | null;
}

export interface TermDetail extends ConceptTerm {
  relatedIssues: Pick<IssueBubble, "id" | "label" | "title">[];
  relatedScholars: Pick<ScholarPreview, "id" | "name" | "nameZh" | "institution" | "region">[];
  relatedWorkCount: number;
}

export interface IssueBubble {
  id: string;
  label: string;
  title: string;
  summary: string;
  weight: number;
  documentCount: number;
  pathCount: number;
  termIds: string[];
  yearSpan: {
    start: number;
    end: number;
  };
}

export interface ResearchPathPreview {
  id: string;
  label: string;
  summary: string;
  stance: string;
  scholarCount: number;
  workCount: number;
}

export interface ScholarPreview {
  id: string;
  slug: string;
  name: string;
  nameZh?: string;
  region: string;
  institution: string;
  eraFocus: string;
  summary: string;
  tags: string[];
  workCount: number;
  relationCount: number;
}

export interface TimelineEvent {
  year: number;
  works: number;
  scholars: number;
  label: string;
  authors: {
    id: string;
    name: string;
  }[];
}

export interface GeoNode {
  id: string;
  label: string;
  region: string;
  institution: string;
  x: number;
  y: number;
  strength: number;
  level: "primary" | "secondary";
}

export interface GeoFlow {
  source: string;
  target: string;
  intensity: number;
  label: string;
}

export interface IssueDetail {
  id: string;
  label: string;
  title: string;
  summary: string;
  paths: ResearchPathDetail[];
  terms: ConceptTerm[];
  timeline: TimelineEvent[];
  geo: {
    nodes: GeoNode[];
    flows: GeoFlow[];
  };
}

export interface ResearchPathDetail extends ResearchPathPreview {
  scholars: ScholarPreview[];
  highlights: string[];
}

export interface WorkCitation {
  id: string;
  title: string;
  titleZh?: string;
  year: number;
  venue: string;
  doi?: string;
  cnkiId?: string;
  source: SourceName;
  citationCount: number;
  authors: string[];
  abstract?: string;
  argumentOutline: {
    label: string;
    detail: string;
  }[];
  url?: string;
  keywords: string[];
  relatedScholarIds: string[];
}

export interface RelatedScholar {
  id: string;
  name: string;
  relation: RelationType;
  summary: string;
  institution: string;
  region: string;
  workCount: number;
}

export interface ScholarDetail extends ScholarPreview {
  biography: string;
  terms: ConceptTerm[];
  issues: Pick<IssueBubble, "id" | "label" | "title">[];
  paths: ResearchPathPreview[];
  works: WorkCitation[];
  relatedScholars: RelatedScholar[];
  branchScholars: RelatedScholar[];
  timeline: TimelineEvent[];
  geo: {
    nodes: GeoNode[];
    flows: GeoFlow[];
  };
}

export interface WorkDetail extends WorkCitation {
  relatedTerms: ConceptTerm[];
  relatedScholars: ScholarPreview[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  strength: number;
  meta?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  label: string;
}

export interface GraphPayload {
  scope: GraphScope;
  id: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface SourceRecord {
  provider: SourceName;
  status: "ready" | "fallback" | "degraded";
  note: string;
}

export interface ProviderHealth {
  provider: SourceName;
  status: "ready" | "offline" | "fallback";
  latencyMs: number;
  message: string;
}

export interface ExplorerPayload {
  philosopher: PhilosopherSummary;
  defaultRange: [number, number];
  issues: IssueBubble[];
  metrics: {
    scholars: number;
    works: number;
    terms: number;
    regions: number;
    cnkiWorks: number;
  };
  sourceRecords: SourceRecord[];
}

export interface RefreshSnapshot {
  scope: Exclude<GraphScope, "philosopher">;
  id: string;
  providerHealth: ProviderHealth[];
  updatedAt: string;
  mergedWorks: number;
  usedFallback: boolean;
}
