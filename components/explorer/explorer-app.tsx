"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ResearchGraph } from "@/components/graph/research-graph";
import { cn, formatRelationLabel, shortNumber } from "@/lib/utils";
import type { ExplorerPayload, GeoNode, IssueDetail, ScholarDetail, WorkDetail } from "@/types/explorer";

type CenterMode = "paths" | "timeline" | "geo";
type GraphScopeState = { scope: "issue" | "scholar" | "work"; id: string; title: string };

const bubblePositions = [
  { top: "10%", left: "12%" },
  { top: "8%", left: "58%" },
  { top: "34%", left: "30%" },
  { top: "38%", left: "70%" },
  { top: "66%", left: "16%" },
  { top: "70%", left: "54%" }
];

async function getJson<T>(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function ExplorerApp({ explorer, initialIssue, initialScholar }: { explorer: ExplorerPayload; initialIssue: IssueDetail; initialScholar: ScholarDetail }) {
  const [selectedIssue, setSelectedIssue] = useState(initialIssue);
  const [selectedScholar, setSelectedScholar] = useState(initialScholar);
  const [selectedWork, setSelectedWork] = useState<WorkDetail | null>(null);
  const [centerMode, setCenterMode] = useState<CenterMode>("paths");
  const [graphScope, setGraphScope] = useState<GraphScopeState | null>(null);
  const [pendingLabel, setPendingLabel] = useState<string | null>(null);
  const [isScholarPanelHighlighted, setScholarPanelHighlighted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const issueCacheRef = useRef(new Map<string, IssueDetail>([[initialIssue.id, initialIssue]]));
  const scholarCacheRef = useRef(new Map<string, ScholarDetail>([[initialScholar.id, initialScholar]]));
  const workCacheRef = useRef(new Map<string, WorkDetail>());
  const scholarPanelRef = useRef<HTMLElement | null>(null);
  const scholarPanelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const issueCountMax = useMemo(() => Math.max(...explorer.issues.map((issue) => issue.weight)), [explorer.issues]);
  const issueInsights = useMemo(
    () => ({
      paths: summarizePaths(selectedIssue),
      timeline: summarizeTimeline(selectedIssue),
      geo: summarizeGeo(selectedIssue)
    }),
    [selectedIssue]
  );
  const pathComparisons = useMemo(() => buildPathComparisons(selectedIssue), [selectedIssue]);

  useEffect(() => {
    return () => {
      if (scholarPanelTimerRef.current) {
        clearTimeout(scholarPanelTimerRef.current);
      }
    };
  }, []);

  async function loadIssue(issueId: string) {
    const cached = issueCacheRef.current.get(issueId);
    if (cached) {
      return cached;
    }
    const detail = await getJson<IssueDetail>(`/api/issues/${issueId}`);
    issueCacheRef.current.set(issueId, detail);
    return detail;
  }

  async function loadScholar(scholarId: string) {
    const cached = scholarCacheRef.current.get(scholarId);
    if (cached) {
      return cached;
    }
    const detail = await getJson<ScholarDetail>(`/api/scholars/${scholarId}`);
    scholarCacheRef.current.set(scholarId, detail);
    return detail;
  }

  async function loadWork(workId: string) {
    const cached = workCacheRef.current.get(workId);
    if (cached) {
      return cached;
    }
    const detail = await getJson<WorkDetail>(`/api/works/${workId}`);
    workCacheRef.current.set(workId, detail);
    return detail;
  }

  function focusScholarPanel() {
    scholarPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setScholarPanelHighlighted(true);
    if (scholarPanelTimerRef.current) {
      clearTimeout(scholarPanelTimerRef.current);
    }
    scholarPanelTimerRef.current = setTimeout(() => setScholarPanelHighlighted(false), 900);
  }

  async function chooseIssue(issueId: string) {
    if (issueId === selectedIssue.id) {
      return;
    }
    setPendingLabel(issueId);
    try {
      const detail = await loadIssue(issueId);
      const firstScholar = detail.paths[0]?.scholars[0];
      let nextScholar = selectedScholar;

      if (firstScholar && firstScholar.id !== selectedScholar.id) {
        nextScholar = await loadScholar(firstScholar.id);
      }

      startTransition(() => {
        setSelectedIssue(detail);
        setSelectedScholar(nextScholar);
        setCenterMode("paths");
        setSelectedWork(null);
      });
    } finally {
      setPendingLabel(null);
    }
  }

  async function chooseScholar(scholarId: string) {
    if (scholarId === selectedScholar.id) {
      focusScholarPanel();
      return;
    }
    setPendingLabel(scholarId);
    try {
      const detail = await loadScholar(scholarId);
      startTransition(() => {
        setSelectedScholar(detail);
        setSelectedWork(null);
      });
      focusScholarPanel();
    } finally {
      setPendingLabel(null);
    }
  }

  async function chooseWork(workId: string) {
    if (workId === selectedWork?.id) {
      return;
    }
    setPendingLabel(workId);
    try {
      const detail = await loadWork(workId);
      startTransition(() => {
        setSelectedWork(detail);
      });
    } finally {
      setPendingLabel(null);
    }
  }

  return (
    <LayoutGroup>
      <main className="min-h-screen overflow-hidden px-4 py-4 text-ink md:px-6">
        <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1600px] grid-cols-1 gap-4 xl:grid-cols-[300px_minmax(0,1fr)_380px]">
          <section className="relative overflow-hidden rounded-2xl border border-line/70 bg-white/78 p-5 shadow-panel backdrop-blur xl:p-6">
            <div className="absolute inset-0 bg-time-flow opacity-60" />
            <div className="relative space-y-5">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-accentSoft">Philosopher Research Atlas</div>
                <h1 className="mt-3 text-3xl font-semibold text-ink">{explorer.philosopher.label}</h1>
                <div className="mt-2 text-sm text-accent">
                  {explorer.philosopher.name} · {explorer.philosopher.lifespan}
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">{explorer.philosopher.overview}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                <MetricCard label="问题" value={explorer.issues.length} />
                <MetricCard label="研究者" value={explorer.metrics.scholars} />
                <MetricCard label="论文" value={explorer.metrics.works} />
                <MetricCard label="区域" value={explorer.metrics.regions} />
                <MetricCard label="知网收录" value={explorer.metrics.cnkiWorks} />
              </div>

              <div className="rounded-2xl border border-line/70 bg-canvas/70 p-4">
                <div className="text-sm font-medium text-accent">当前视图</div>
                <div className="mt-2 text-2xl font-semibold">{selectedIssue.label}</div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{selectedIssue.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedIssue.terms.map((term) => (
                    <TermChip key={term.id} term={term} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-line/70 bg-white/80 p-4">
                <div className="text-sm font-medium text-accent">数据来源层</div>
                <div className="mt-3 space-y-3">
                  {explorer.sourceRecords.map((record) => (
                    <div key={record.provider} className="rounded-xl border border-line/60 bg-canvas/60 p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium uppercase tracking-[0.12em] text-accent">{record.provider}</span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[11px] text-slate-600">
                          {record.provider === "cnki" ? "CNKI" : record.status}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-600">{record.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-line/70 bg-white/72 shadow-panel backdrop-blur">
            <div className="absolute inset-0 grid-lines opacity-40" />
            <div className="relative flex h-full flex-col p-4 md:p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-accentSoft">Questions, Paths, Time, Global Reach</div>
                  <h2 className="mt-2 text-2xl font-semibold">近几十年康德研究主问题云图</h2>
                </div>
                <div className="flex rounded-full border border-line/70 bg-white/90 p-1 text-sm">
                  {([
                    ["paths", "进路"],
                    ["timeline", "时间轴"],
                    ["geo", "全球视野"]
                  ] as const).map(([mode, label]) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setCenterMode(mode)}
                      className={`rounded-full px-4 py-2 transition ${centerMode === mode ? "bg-accent text-white" : "text-slate-600 hover:text-accent"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
                <div className="relative h-[420px] rounded-2xl border border-line/70 bg-canvas/70 p-4">
                  <motion.div
                    className="absolute inset-4 rounded-[28px] border border-line/50"
                    animate={{ rotate: [0, 0.4, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {explorer.issues.map((issue, index) => {
                    const pos = bubblePositions[index % bubblePositions.length];
                    const isActive = selectedIssue.id === issue.id;
                    const size = 116 + (issue.weight / issueCountMax) * 104;
                    return (
                      <motion.button
                        key={issue.id}
                        type="button"
                        layoutId={`issue-${issue.id}`}
                        onClick={() => void chooseIssue(issue.id)}
                        whileTap={{ scale: 0.96 }}
                        whileHover={{ scale: isActive ? 1.05 : 1.02 }}
                        className={`absolute grid place-items-center rounded-full border text-center shadow-panel transition ${isActive ? "border-accent bg-accent text-white" : "border-line/70 bg-white/90 text-ink hover:border-accent hover:text-accent"}`}
                        style={{ top: pos.top, left: pos.left, width: size, height: size }}
                        animate={{ y: [0, -8, 0], scale: isActive ? 1.04 : 1 }}
                        transition={{ duration: 4.6 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="px-4">
                          <div className="text-base font-semibold leading-tight">{issue.label}</div>
                          <div className={`mt-2 text-[11px] ${isActive ? "text-white/85" : "text-slate-500"}`}>
                            {issue.yearSpan.start}-{issue.yearSpan.end}
                          </div>
                          <div className={`mt-1 text-xs ${isActive ? "text-white/80" : "text-slate-500"}`}>{shortNumber(issue.documentCount)} 篇</div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-line/70 bg-white/85 p-4 md:p-5">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${selectedIssue.id}-${centerMode}`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      {centerMode === "paths" ? (
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm text-accent">主要问题</div>
                              <h3 className="mt-2 text-2xl font-semibold">{selectedIssue.title}</h3>
                            </div>
                            <button
                              type="button"
                              onClick={() => setGraphScope({ scope: "issue", id: selectedIssue.id, title: selectedIssue.label })}
                              className="rounded-full border border-line px-4 py-2 text-sm text-accent transition hover:border-accent hover:bg-canvas"
                            >
                              展开图谱
                            </button>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-slate-700">{selectedIssue.summary}</p>

                          <div className="mt-4 rounded-2xl border border-line/70 bg-canvas/60 p-4 text-sm text-slate-700">
                            <div className="font-medium text-accent">进路总结</div>
                            <p className="mt-2 leading-7">{issueInsights.paths}</p>
                          </div>

                          <div className="mt-4 grid gap-3 md:grid-cols-2">
                            {pathComparisons.map((comparison) => (
                              <div key={comparison.id} className="rounded-2xl border border-line/70 bg-white/92 p-4">
                                <div className="text-sm font-medium text-accent">{comparison.label}</div>
                                <p className="mt-2 text-sm leading-6 text-slate-700">{comparison.summary}</p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-5 space-y-3">
                            {selectedIssue.paths.map((path) => (
                              <motion.div key={path.id} layout className="rounded-2xl border border-line/70 bg-canvas/70 p-4">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                  <div>
                                    <div className="text-lg font-semibold">{path.label}</div>
                                    <div className="mt-1 text-sm text-accent">{path.stance}</div>
                                  </div>
                                  <div className="flex gap-2 text-xs text-slate-500">
                                    <span>{path.scholarCount} 位研究者</span>
                                    <span>{path.workCount} 篇代表作</span>
                                  </div>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-slate-700">{path.summary}</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {path.highlights.map((highlight) => (
                                    <span key={highlight} className="rounded-full bg-white px-3 py-1 text-xs text-accent">
                                      {highlight}
                                    </span>
                                  ))}
                                </div>
                                <div className="mt-4 grid gap-2 md:grid-cols-2">
                                  {path.scholars.map((scholar) => (
                                    <button
                                      key={scholar.id}
                                      type="button"
                                      onClick={() => void chooseScholar(scholar.id)}
                                      className="rounded-xl border border-line/70 bg-white/95 p-3 text-left transition hover:border-accent hover:bg-canvas"
                                    >
                                      <div className="font-medium">{scholar.nameZh ?? scholar.name}</div>
                                      <div className="mt-1 text-xs text-slate-500">
                                        {scholar.institution} · {scholar.region}
                                      </div>
                                      <div className="mt-2 text-sm leading-6 text-slate-700">{scholar.summary}</div>
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {centerMode === "timeline" ? (
                        <TimelineView issue={selectedIssue} insight={issueInsights.timeline} onSelectScholar={chooseScholar} />
                      ) : null}
                      {centerMode === "geo" ? <GeoView issue={selectedIssue} insight={issueInsights.geo} onSelectScholar={chooseScholar} /> : null}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>

          <aside
            ref={scholarPanelRef}
            className={cn(
              "relative overflow-hidden rounded-2xl border border-line/70 bg-white/80 shadow-panel backdrop-blur transition",
              isScholarPanelHighlighted ? "ring-2 ring-accent/30" : ""
            )}
          >
            <div className="absolute inset-0 bg-time-flow opacity-35" />
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedScholar.id}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative flex h-full flex-col p-5 md:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-accentSoft">Scholar Detail</div>
                    <h3 className="mt-2 text-2xl font-semibold">{selectedScholar.nameZh ?? selectedScholar.name}</h3>
                    <div className="mt-2 text-sm text-accent">
                      {selectedScholar.institution} · {selectedScholar.region}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setGraphScope({
                        scope: "scholar",
                        id: selectedScholar.id,
                        title: selectedScholar.nameZh ?? selectedScholar.name
                      })
                    }
                    className="rounded-full border border-line px-4 py-2 text-sm text-accent transition hover:border-accent hover:bg-white"
                  >
                    关系图谱
                  </button>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-700">{selectedScholar.biography}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedScholar.terms.map((term) => (
                    <TermChip key={term.id} term={term} />
                  ))}
                </div>

                <div className="mt-5 rounded-2xl border border-line/70 bg-canvas/65 p-4">
                  <div className="text-sm font-medium text-accent">关联问题与进路</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedScholar.issues.map((issue) => (
                      <button
                        key={issue.id}
                        type="button"
                        onClick={() => void chooseIssue(issue.id)}
                        className="rounded-full bg-white px-3 py-1 text-xs text-slate-700 transition hover:text-accent"
                      >
                        {issue.label}
                      </button>
                    ))}
                    {selectedScholar.paths.map((path) => (
                      <span key={path.id} className="rounded-full border border-white/80 px-3 py-1 text-xs text-accent">
                        {path.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex-1 overflow-y-auto pr-1">
                  <SectionTitle title="代表论文" subtitle="点击后展开论文摘要、关键词与论文图谱" />
                  <div className="mt-3 space-y-3">
                    {selectedScholar.works.map((work) => (
                      <button
                        key={work.id}
                        type="button"
                        onClick={() => void chooseWork(work.id)}
                        className="w-full rounded-2xl border border-line/70 bg-white/95 p-4 text-left transition hover:border-accent hover:bg-canvas"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium leading-6">{work.titleZh ?? work.title}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              {work.year} · {work.venue}
                            </div>
                          </div>
                          <div className="rounded-full bg-canvas px-2 py-1 text-[11px] text-accent">{formatSourceLabel(work.source, work.cnkiId)}</div>
                        </div>
                        <div className="mt-2 text-sm leading-6 text-slate-700">{work.abstract}</div>
                        <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
                          {work.cnkiId ? <span className="rounded-full border border-line/70 bg-canvas/70 px-2 py-1">CNKI {work.cnkiId}</span> : null}
                          {work.doi ? <span className="rounded-full border border-line/70 bg-canvas/70 px-2 py-1">DOI</span> : null}
                          {work.argumentOutline[0] ? <span className="rounded-full border border-line/70 bg-canvas/70 px-2 py-1">含摘要拆解</span> : null}
                        </div>
                      </button>
                    ))}
                  </div>

                  <SectionTitle title="相关人物" subtitle="师承、影响与合作脉络" />
                  <div className="mt-3 space-y-3">
                    {selectedScholar.relatedScholars.map((person) => (
                      <motion.button
                        key={`${person.id}-${person.relation}`}
                        type="button"
                        whileTap={{ scale: 0.985 }}
                        onClick={() => void chooseScholar(person.id)}
                        className="w-full rounded-2xl border border-line/70 bg-canvas/70 p-4 text-left transition hover:border-accent hover:bg-white"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium">{person.name}</div>
                          <div className="rounded-full bg-white px-2 py-1 text-[11px] text-accent">{formatRelationLabel(person.relation)}</div>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {person.institution} · {person.region}
                        </div>
                        <div className="mt-2 text-sm leading-6 text-slate-700">{person.summary}</div>
                      </motion.button>
                    ))}
                  </div>

                  <SectionTitle title="分支学者" subtitle="沿影响链和同一路径延伸出的下游节点" />
                  <div className="mt-3 space-y-3">
                    {selectedScholar.branchScholars.map((person) => (
                      <motion.button
                        key={`branch-${person.id}-${person.relation}`}
                        type="button"
                        whileTap={{ scale: 0.985 }}
                        onClick={() => void chooseScholar(person.id)}
                        className="w-full rounded-2xl border border-line/70 bg-white/92 p-4 text-left transition hover:border-accent hover:bg-canvas"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="font-medium">{person.name}</div>
                          <div className="rounded-full bg-canvas px-2 py-1 text-[11px] text-accent">{formatRelationLabel(person.relation)}</div>
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {person.institution} · {person.region}
                        </div>
                        <div className="mt-2 text-sm leading-6 text-slate-700">{person.summary}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </aside>
        </div>

        <AnimatePresence>
          {selectedWork ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-ink/35 backdrop-blur-sm">
              <motion.div
                initial={{ y: 36, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="absolute inset-x-4 bottom-4 mx-auto max-w-4xl rounded-2xl border border-line/70 bg-white p-5 shadow-panel md:inset-x-6"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-accentSoft">Representative Work</div>
                    <h4 className="mt-2 text-2xl font-semibold">{selectedWork.titleZh ?? selectedWork.title}</h4>
                    <div className="mt-2 text-sm text-accent">
                      {selectedWork.year} · {selectedWork.venue}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setGraphScope({
                          scope: "work",
                          id: selectedWork.id,
                          title: selectedWork.titleZh ?? selectedWork.title
                        })
                      }
                      className="rounded-full border border-line px-4 py-2 text-sm text-accent transition hover:border-accent"
                    >
                      论文图谱
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedWork(null)}
                      className="rounded-full border border-line px-4 py-2 text-sm text-slate-600 transition hover:border-accent hover:text-accent"
                    >
                      关闭
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">{selectedWork.abstract}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                  <div className="rounded-2xl border border-line/70 bg-canvas/60 p-4">
                    <div className="text-sm font-medium text-accent">摘要拆解</div>
                    <div className="mt-3 space-y-2 text-sm text-slate-700">
                      {selectedWork.argumentOutline.map((item) => (
                        <div key={`${item.label}-${item.detail}`} className="rounded-xl border border-line/60 bg-white/90 px-3 py-2">
                          <div className="text-xs font-medium uppercase tracking-[0.12em] text-accentSoft">{item.label}</div>
                          <div className="mt-1 leading-6">{item.detail}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-line/70 bg-canvas/60 p-4">
                    <div className="text-sm font-medium text-accent">关联关键词</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedWork.relatedTerms.map((term) => (
                        <TermChip key={term.id} term={term} compact />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                  <div className="rounded-xl border border-line/70 bg-canvas/60 p-3">来源: {formatSourceLabel(selectedWork.source, selectedWork.cnkiId)}</div>
                  <div className="rounded-xl border border-line/70 bg-canvas/60 p-3">DOI: {selectedWork.doi ?? "无"}</div>
                  <div className="rounded-xl border border-line/70 bg-canvas/60 p-3">CNKI: {selectedWork.cnkiId ?? "无"}</div>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {graphScope ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-ink/50 p-4 backdrop-blur-sm md:p-6">
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="mx-auto flex h-full max-w-6xl flex-col rounded-3xl border border-line/70 bg-white p-5 shadow-panel md:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-accentSoft">Network Graph</div>
                    <h4 className="mt-2 text-2xl font-semibold">{graphScope.title}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGraphScope(null)}
                    className="rounded-full border border-line px-4 py-2 text-sm text-slate-600 transition hover:border-accent hover:text-accent"
                  >
                    关闭图谱
                  </button>
                </div>
                <div className="mt-5 flex-1">
                  <ResearchGraph scope={graphScope.scope} id={graphScope.id} />
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {pendingLabel || isPending ? (
          <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-accent px-4 py-2 text-sm text-white shadow-panel">
            正在切换视图...
          </div>
        ) : null}
      </main>
    </LayoutGroup>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mt-6">
      <div className="text-sm font-medium text-accent">{title}</div>
      <div className="mt-1 text-xs text-slate-500">{subtitle}</div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-white/85 p-4">
      <div className="text-xs uppercase tracking-[0.16em] text-accentSoft">{label}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function TermChip({ term, compact = false }: { term: IssueDetail["terms"][number]; compact?: boolean }) {
  const chipClass = compact ? "px-3 py-1 text-xs" : "px-3 py-1 text-xs";

  return (
    <div className="group relative">
      {term.sep?.url ? (
        <a
          href={term.sep.url}
          target="_blank"
          rel="noreferrer"
          className={`rounded-full border border-line/80 bg-white/90 text-accent transition hover:border-accent hover:text-ink ${chipClass}`}
        >
          {term.label}
        </a>
      ) : (
        <span className={`rounded-full border border-line/80 bg-white/90 text-accent ${chipClass}`}>{term.label}</span>
      )}
      <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 translate-y-1 rounded-2xl border border-line/70 bg-white/96 p-3 text-left opacity-0 shadow-panel transition duration-200 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="text-sm font-medium text-ink">{term.label}</div>
        <div className="mt-2 text-xs leading-5 text-slate-600">{term.gloss}</div>
        {term.sep?.summary ? <div className="mt-2 text-xs leading-5 text-accent">{term.sep.summary}</div> : null}
      </div>
    </div>
  );
}

function TimelineView({
  issue,
  insight,
  onSelectScholar
}: {
  issue: IssueDetail;
  insight: string;
  onSelectScholar: (scholarId: string) => Promise<void>;
}) {
  const max = Math.max(...issue.timeline.map((item) => item.works), 1);
  const defaultYear = issue.timeline.reduce((best, current) => (current.works > best.works ? current : best), issue.timeline[0]).year;
  const [activeYear, setActiveYear] = useState(defaultYear);

  useEffect(() => {
    setActiveYear(defaultYear);
  }, [defaultYear, issue.id]);

  const activeEvent = issue.timeline.find((item) => item.year === activeYear) ?? issue.timeline[0];
  const startYear = issue.timeline[0]?.year ?? issue.label;
  const endYear = issue.timeline[issue.timeline.length - 1]?.year ?? issue.label;

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-accent">时间切片</div>
          <h3 className="mt-2 text-2xl font-semibold">研究热度与参与者演化</h3>
        </div>
        <div className="rounded-full border border-line px-3 py-1 text-xs text-slate-500">
          {startYear} - {endYear}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-line/70 bg-canvas/60 p-4 text-sm text-slate-700">
        <div className="font-medium text-accent">时间轴分析</div>
        <p className="mt-2 leading-7">{insight}</p>
      </div>

      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(78px,1fr))] items-end gap-3 rounded-2xl border border-line/70 bg-canvas/70 p-4">
        {issue.timeline.map((item) => {
          const active = item.year === activeYear;
          const leadAuthor = item.authors[0]?.name ?? "待补";
          const extraAuthors = Math.max(0, item.authors.length - 1);
          return (
            <button
              key={item.year}
              type="button"
              onMouseEnter={() => setActiveYear(item.year)}
              onFocus={() => setActiveYear(item.year)}
              onClick={() => setActiveYear(item.year)}
              className={cn(
                "flex min-h-[252px] flex-col items-center justify-end gap-2 rounded-2xl px-2 py-3 text-center transition",
                active ? "bg-white/80 shadow-sm" : "hover:bg-white/60"
              )}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(24, (item.works / max) * 180)}px` }}
                className={cn("timeline-bar w-full rounded-t-xl", active ? "timeline-bar-active" : "")}
              />
              <div className="text-[11px] font-medium text-slate-500">{item.year}</div>
              <div className="text-[11px] text-accent">
                {item.works} 篇 / {item.scholars} 人
              </div>
              <div className="min-h-[32px] text-[11px] leading-4 text-slate-600">
                <div>{leadAuthor}</div>
                {extraAuthors ? <div className="text-slate-400">+{extraAuthors}</div> : null}
              </div>
            </button>
          );
        })}
      </div>

      {activeEvent ? (
        <motion.div
          key={`${issue.id}-${activeEvent.year}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-2xl border border-line/70 bg-white/92 p-4"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-medium text-accent">{activeEvent.year} 年节点</div>
              <div className="mt-1 text-sm text-slate-600">
                这一年图谱中累计出现 {activeEvent.works} 篇代表论文，主要讨论者共 {activeEvent.scholars} 位。
              </div>
            </div>
            <div className="rounded-full border border-line/70 bg-canvas/70 px-3 py-1 text-xs text-slate-500">{issue.label}</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {activeEvent.authors.map((author) => (
              <button
                key={`${activeEvent.year}-${author.id}`}
                type="button"
                onClick={() => void onSelectScholar(author.id)}
                className="rounded-full border border-line/70 bg-canvas px-3 py-1 text-xs text-accent transition hover:border-accent hover:bg-white"
              >
                {author.name}
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

function GeoView({
  issue,
  insight,
  onSelectScholar
}: {
  issue: IssueDetail;
  insight: string;
  onSelectScholar: (scholarId: string) => Promise<void>;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    dragStateRef.current = null;
  }, [issue.id]);

  const visibleNodes = useMemo(
    () =>
      issue.geo.nodes.filter((node) => {
        if (node.level === "primary") {
          return true;
        }
        if (zoom < 1.14) {
          return false;
        }
        if (zoom < 1.34) {
          return node.strength >= 2;
        }
        return true;
      }),
    [issue.geo.nodes, zoom]
  );
  const visibleIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const visibleFlows = useMemo(
    () => issue.geo.flows.filter((flow) => visibleIds.has(flow.source) && visibleIds.has(flow.target)),
    [issue.geo.flows, visibleIds]
  );

  function changeZoom(nextZoom: number, anchor?: { clientX: number; clientY: number }) {
    const clamped = Number(Math.max(1, Math.min(2.25, nextZoom)).toFixed(2));
    if (clamped === zoom) {
      return;
    }

    if (!anchor || !containerRef.current) {
      setZoom(clamped);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const dx = anchor.clientX - rect.left - rect.width / 2;
    const dy = anchor.clientY - rect.top - rect.height / 2;
    const ratio = clamped / zoom;

    setPan((current) => ({
      x: current.x - dx * (ratio - 1),
      y: current.y - dy * (ratio - 1)
    }));
    setZoom(clamped);
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    changeZoom(zoom + (event.deltaY < 0 ? 0.14 : -0.14), { clientX: event.clientX, clientY: event.clientY });
  }

  function handlePointerDown(event: React.MouseEvent<HTMLDivElement>) {
    if (zoom <= 1) {
      return;
    }
    dragStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y
    };
    setIsDragging(true);
  }

  function handlePointerMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!dragStateRef.current) {
      return;
    }
    const dx = event.clientX - dragStateRef.current.startX;
    const dy = event.clientY - dragStateRef.current.startY;
    setPan({
      x: dragStateRef.current.originX + dx,
      y: dragStateRef.current.originY + dy
    });
  }

  function stopDragging() {
    dragStateRef.current = null;
    setIsDragging(false);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-accent">全球视野</div>
          <h3 className="mt-2 text-2xl font-semibold">学者分布与跨区域传播</h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-line bg-white/90 px-2 py-1 text-xs text-slate-500">
          <button
            type="button"
            onClick={() => changeZoom(zoom - 0.18)}
            className="grid h-7 w-7 place-items-center rounded-full border border-line/70 transition hover:border-accent hover:text-accent"
          >
            -
          </button>
          <span className="min-w-10 text-center">{zoom.toFixed(2)}x</span>
          <button
            type="button"
            onClick={() => changeZoom(zoom + 0.18)}
            className="grid h-7 w-7 place-items-center rounded-full border border-line/70 transition hover:border-accent hover:text-accent"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="rounded-full border border-line/70 px-2 py-1 transition hover:border-accent hover:text-accent"
          >
            复位
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-line/70 bg-canvas/60 p-4 text-sm text-slate-700">
        <div className="font-medium text-accent">全球视野分析</div>
        <p className="mt-2 leading-7">{insight}</p>
      </div>

      <div
        ref={containerRef}
        className={cn(
          "relative mt-5 h-[350px] overflow-hidden rounded-2xl border border-line/70 bg-canvas/70 select-none",
          zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
        )}
        onWheel={handleWheel}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        <motion.div
          animate={{ scale: zoom, x: pan.x, y: pan.y }}
          transition={{ duration: 0.24, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute inset-0 origin-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45),transparent_48%)]" />
          <WorldMapBackdrop />
          {visibleFlows.map((flow) => {
            const source = visibleNodes.find((node) => node.id === flow.source);
            const target = visibleNodes.find((node) => node.id === flow.target);
            if (!source || !target) {
              return null;
            }
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const width = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            return (
              <div
                key={`${flow.source}-${flow.target}`}
                className="flow-line"
                style={{
                  left: `${source.x}%`,
                  top: `${source.y}%`,
                  width: `${width}%`,
                  opacity: Math.max(0.35, flow.intensity),
                  transform: `rotate(${angle}deg)`
                }}
              />
            );
          })}
          {visibleNodes.map((node) => {
            const offset = resolveGeoLabelOffset(node, visibleNodes);
            return (
              <motion.div
                key={node.id}
                initial={{ scale: 0.84, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div
                  className={cn(
                    "geo-node-dot",
                    node.level === "secondary" ? "geo-node-dot-secondary" : "geo-node-dot-primary"
                  )}
                />
                <button
                  type="button"
                  onClick={() => void onSelectScholar(node.id)}
                  className={cn(
                    "absolute rounded-2xl border px-3 py-2 text-left text-xs shadow-panel transition hover:border-accent hover:bg-white",
                    node.level === "secondary" ? "border-line/70 bg-white/90" : "border-white/80 bg-white/95"
                  )}
                  style={{
                    left: `${offset.x}px`,
                    top: `${offset.y}px`,
                    minWidth: node.level === "secondary" ? "112px" : "132px",
                    maxWidth: "156px",
                    transform: offset.align === "right" ? "translateX(-100%)" : "translateX(0)"
                  }}
                >
                  <div className="font-medium text-ink">{node.label}</div>
                  <div className="mt-1 text-[11px] text-slate-500">{node.region}</div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
          {["北美", "英国", "法国/北美", "德国", "中国"].map((label) => (
            <span key={label} className="rounded-full border border-white/70 bg-white/85 px-2 py-1">
              {label}
            </span>
          ))}
          <span className="rounded-full border border-white/70 bg-white/85 px-2 py-1">{zoom > 1.14 ? "已展开二级学者" : "滚轮或按钮放大后显示二级学者"}</span>
        </div>
      </div>
    </div>
  );
}

function WorldMapBackdrop() {
  return (
    <svg viewBox="0 0 1000 500" className="pointer-events-none absolute inset-0 h-full w-full opacity-80" aria-hidden="true">
      <g fill="rgba(159, 183, 178, 0.34)" stroke="rgba(126, 154, 149, 0.38)" strokeWidth="4">
        <path d="M88 132l54-38 70 6 22 23-10 33-48 18-18 32-41 12-37-23-13-29 21-34z" />
        <path d="M194 236l29-12 27 17 16 46-27 60-37 10-25-31 7-42z" />
        <path d="M414 88l68-15 83 20 38 30-26 34-57 5-32 28-49-11-41-41z" />
        <path d="M484 198l43 10 52 36 16 61-37 55-59 2-35-48 6-55z" />
        <path d="M603 126l40-22 54 17 11 29-24 22-44 3-32-18z" />
        <path d="M706 166l47-10 76 31 54 43-18 34-70 8-59-23-23-31z" />
        <path d="M790 284l30-9 26 23-5 41-34 32-44-18-12-37 16-22z" />
      </g>
      <g stroke="rgba(172, 190, 186, 0.45)" strokeWidth="1">
        <path d="M0 90h1000" />
        <path d="M0 170h1000" />
        <path d="M0 250h1000" />
        <path d="M0 330h1000" />
        <path d="M0 410h1000" />
        <path d="M166 0v500" />
        <path d="M333 0v500" />
        <path d="M500 0v500" />
        <path d="M666 0v500" />
        <path d="M833 0v500" />
      </g>
      <g fill="rgba(82, 108, 104, 0.68)" fontSize="18">
        <text x="120" y="116">North America</text>
        <text x="434" y="112">Europe</text>
        <text x="606" y="152">Central Asia</text>
        <text x="758" y="192">East Asia</text>
      </g>
    </svg>
  );
}

function summarizePaths(issue: IssueDetail) {
  const dominantPath = issue.paths.reduce((best, current) => (current.scholarCount > best.scholarCount ? current : best), issue.paths[0]);
  const regions = new Set(issue.geo.nodes.filter((node) => node.level === "primary").map((node) => node.region)).size;
  const contrastPath = issue.paths.find((path) => path.id !== dominantPath.id) ?? dominantPath;
  return `${issue.label} 当前由 ${issue.paths.length} 条研究进路组成，其中 ${dominantPath.label} 聚集的研究者最多。与它相比，${contrastPath.label} 更强调 ${contrastPath.highlights.slice(0, 2).join("、")}，说明同一问题内部已经形成可比较的解释分流，并且讨论已经跨越 ${regions} 个区域。`;
}

function summarizeTimeline(issue: IssueDetail) {
  const peak = issue.timeline.reduce((best, current) => (current.works > best.works ? current : best), issue.timeline[0]);
  const latest = issue.timeline[issue.timeline.length - 1];
  const peakAuthors = peak.authors.slice(0, 2).map((author) => author.name).join("、");
  return `${issue.label} 的研究高峰出现在 ${peak.year} 年前后，当年共有 ${peak.works} 篇代表性作品进入图谱，活跃作者主要包括 ${peakAuthors || "相关核心学者"}。最近的时间节点是 ${latest.year} 年，说明这个问题并没有停留在经典解释阶段，而是仍在持续更新。`;
}

function summarizeGeo(issue: IssueDetail) {
  const primaryNodes = issue.geo.nodes.filter((node) => node.level === "primary");
  const secondaryNodes = issue.geo.nodes.filter((node) => node.level === "secondary");
  const regionCount = new Set(primaryNodes.map((node) => node.region)).size;
  return `${issue.label} 的一线研究者目前覆盖 ${regionCount} 个主要区域，并且还能继续向外展开 ${secondaryNodes.length} 位二级学者。地图支持继续放大和拖拽，因此可以把主要节点让开之后继续追踪下游学者的传播结构。`;
}

function buildPathComparisons(issue: IssueDetail) {
  const anchor = issue.paths.reduce((best, current) => (current.scholarCount > best.scholarCount ? current : best), issue.paths[0]);
  return issue.paths.map((path) => {
    if (path.id === anchor.id) {
      return {
        id: path.id,
        label: `${path.label} 的主干位置`,
        summary: `这一路线在当前问题下吸纳的学者最多，重点放在 ${path.highlights.slice(0, 2).join("、")} 上，通常承担当前议题的基准解释。`
      };
    }

    return {
      id: path.id,
      label: `${path.label} 与 ${anchor.label} 的差异`,
      summary: `相较于 ${anchor.label}，这一路线更突出 ${path.highlights.slice(0, 2).join("、")}，并以“${path.stance}”作为切入点，因此更适合用来识别同一问题下的细部分歧。`
    };
  });
}

function resolveGeoLabelOffset(node: GeoNode, nodes: GeoNode[]) {
  const nearbyCount = nodes.filter((other) => other.id !== node.id && Math.abs(other.x - node.x) < 6 && Math.abs(other.y - node.y) < 8).length;
  const prefersLeft = node.x > 70 || (node.x > 40 && nearbyCount % 2 === 0);
  const yBase = node.y > 55 ? -38 : nearbyCount % 2 === 0 ? -30 : 16;

  return {
    x: prefersLeft ? -18 : 18,
    y: yBase,
    align: prefersLeft ? "right" : "left"
  } as const;
}

function formatSourceLabel(source: string, cnkiId?: string) {
  if (cnkiId || source === "cnki") {
    return "CNKI";
  }

  return {
    openalex: "OpenAlex",
    crossref: "Crossref",
    curated: "Curated",
    cache: "Cache"
  }[source] ?? source;
}
