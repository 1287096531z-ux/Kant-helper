"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type cytoscape from "cytoscape";
import type { GraphPayload, IssueDetail, ScholarDetail, TermDetail, WorkDetail } from "@/types/explorer";

interface ResearchGraphProps {
  scope: GraphPayload["scope"];
  id: string;
}

interface InspectorState {
  title: string;
  subtitle: string;
  summary: string;
  chips: string[];
  bullets: string[];
  neighbors: string[];
  outlineTitle?: string;
  outline?: Array<
    | string
    | {
        label: string;
        detail: string;
      }
  >;
}

const HOP_LAYER_STYLES = [
  {
    threshold: 1.12,
    label: "一级结构已展开",
    nodeClass: "first-hop",
    edgeClass: "first-hop-edge",
    nodeOpacity: 0.72,
    fontSize: 10.5,
    borderColor: "#608783",
    edgeWidth: 1.8,
    edgeOpacity: 0.58,
    edgeColor: "#608783"
  },
  {
    threshold: 1.45,
    label: "二级分支已增强",
    nodeClass: "second-hop",
    edgeClass: "second-hop-edge",
    nodeOpacity: 0.82,
    fontSize: 10.5,
    borderColor: "#b09a63",
    edgeWidth: 2.2,
    edgeOpacity: 0.88,
    edgeColor: "#b09a63"
  },
  {
    threshold: 1.78,
    label: "三级结构已展开",
    nodeClass: "third-hop",
    edgeClass: "third-hop-edge",
    nodeOpacity: 0.62,
    fontSize: 10,
    borderColor: "#6f85a7",
    edgeWidth: 1.9,
    edgeOpacity: 0.58,
    edgeColor: "#6f85a7"
  },
  {
    threshold: 1.98,
    label: "四级线索已显现",
    nodeClass: "fourth-hop",
    edgeClass: "fourth-hop-edge",
    nodeOpacity: 0.56,
    fontSize: 9.9,
    borderColor: "#8d74a6",
    edgeWidth: 1.8,
    edgeOpacity: 0.52,
    edgeColor: "#8d74a6"
  },
  {
    threshold: 2.16,
    label: "五级线索已显现",
    nodeClass: "fifth-hop",
    edgeClass: "fifth-hop-edge",
    nodeOpacity: 0.52,
    fontSize: 9.8,
    borderColor: "#bf7d72",
    edgeWidth: 1.7,
    edgeOpacity: 0.48,
    edgeColor: "#bf7d72"
  },
  {
    threshold: 2.32,
    label: "更远层级已展开",
    nodeClass: "sixth-hop",
    edgeClass: "sixth-hop-edge",
    nodeOpacity: 0.48,
    fontSize: 9.6,
    borderColor: "#8ea167",
    edgeWidth: 1.6,
    edgeOpacity: 0.44,
    edgeColor: "#8ea167"
  }
] as const;

const FAR_HOP_NODE_CLASS = "far-hop";
const FAR_HOP_EDGE_CLASS = "far-hop-edge";
const HOP_CLASS_NAMES: string[] = [
  ...HOP_LAYER_STYLES.flatMap((layer) => [layer.nodeClass, layer.edgeClass]),
  FAR_HOP_NODE_CLASS,
  FAR_HOP_EDGE_CLASS
];

async function getJson<T>(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function ResearchGraph({ scope, id }: ResearchGraphProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const selectedNodeIdRef = useRef<string | null>(null);
  const [payload, setPayload] = useState<GraphPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [inspector, setInspector] = useState<InspectorState | null>(null);
  const [inspectorLoading, setInspectorLoading] = useState(false);

  const selectedNode = useMemo(
    () => payload?.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [payload, selectedNodeId]
  );

  useEffect(() => {
    let instance: cytoscape.Core | undefined;
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setError(null);
        setInspector(null);
        setSelectedNodeId(null);

        const [graphPayload, cytoscapeModule] = await Promise.all([
          getJson<GraphPayload>(`/api/graph?scope=${scope}&id=${id}`),
          import("cytoscape")
        ]);

        if (cancelled || !rootRef.current) {
          return;
        }

        const cytoscape = cytoscapeModule.default;
        const hopLayerStyles = HOP_LAYER_STYLES.flatMap((layer) => [
          {
            selector: `node.${layer.nodeClass}`,
            style: {
              opacity: layer.nodeOpacity,
              "font-size": layer.fontSize,
              "border-width": 2,
              "border-color": layer.borderColor
            }
          },
          {
            selector: `edge.${layer.edgeClass}`,
            style: {
              width: layer.edgeWidth,
              opacity: layer.edgeOpacity,
              "line-color": layer.edgeColor,
              "target-arrow-color": layer.edgeColor
            }
          }
        ]);
        const stylesheet = [
          {
            selector: "node",
            style: {
              label: "data(label)",
              width: "mapData(strength, 2, 14, 42, 90)",
              height: "mapData(strength, 2, 14, 42, 90)",
              "background-color": "#355c5a",
              color: "#0f2025",
              "font-size": 10,
              "font-weight": 500,
              "text-wrap": "wrap",
              "text-max-width": 110,
              "text-valign": "center",
              "text-halign": "center",
              "text-margin-y": 0,
              "overlay-padding": 6,
              "border-width": 1,
              "border-color": "#eef3f2",
              "transition-property": "opacity, border-width, border-color, color, font-size",
              "transition-duration": "220ms",
              opacity: 0.92
            }
          },
          { selector: 'node[type = "issue"]', style: { "background-color": "#b09a63", color: "#102228" } },
          { selector: 'node[type = "path"]', style: { "background-color": "#608783", color: "#102228" } },
          { selector: 'node[type = "work"]', style: { "background-color": "#dce7e4", color: "#102228" } },
          { selector: 'node[type = "term"]', style: { "background-color": "#c9d8d5", color: "#102228" } },
          {
            selector: "node.focused",
            style: {
              "border-width": 4,
              "border-color": "#355c5a",
              opacity: 1,
              "font-size": 11,
              "text-max-width": 132
            }
          },
          ...hopLayerStyles,
          {
            selector: `node.${FAR_HOP_NODE_CLASS}`,
            style: {
              opacity: 0.42,
              "font-size": 9.4,
              "border-width": 1.8,
              "border-color": "#93a4b8"
            }
          },
          { selector: "node.dimmed", style: { opacity: 0.09 } },
          {
            selector: "edge",
            style: {
              width: 1.2,
              "line-color": "#9eb2ae",
              "target-arrow-color": "#9eb2ae",
              "target-arrow-shape": "triangle",
              "curve-style": "bezier",
              label: "data(label)",
              color: "#40605e",
              "font-size": 8,
              "text-wrap": "wrap",
              "text-max-width": 140,
              "text-background-color": "#eef3f2",
              "text-background-opacity": 0.95,
              "text-background-padding": 2,
              "transition-property": "opacity, width, line-color, target-arrow-color",
              "transition-duration": "220ms",
              opacity: 0.82
            }
          },
          {
            selector: `edge.${FAR_HOP_EDGE_CLASS}`,
            style: {
              width: 1.5,
              opacity: 0.38,
              "line-color": "#93a4b8",
              "target-arrow-color": "#93a4b8"
            }
          },
          {
            selector: "edge.focus-edge",
            style: {
              width: 2.4,
              opacity: 1,
              "line-color": "#355c5a",
              "target-arrow-color": "#355c5a"
            }
          },
          { selector: "edge.dimmed", style: { opacity: 0.08 } },
          { selector: 'edge[type = "coauthored_with"]', style: { "line-color": "#b09a63", "target-arrow-color": "#b09a63" } }
        ] as cytoscape.StylesheetJson;

        instance = cytoscape({
          container: rootRef.current,
          elements: {
            nodes: graphPayload.nodes.map((node) => ({ data: node })),
            edges: graphPayload.edges.map((edge) => ({ data: edge }))
          },
          style: stylesheet,
          layout: {
            name: "cose",
            animate: true,
            animationDuration: 720,
            fit: true,
            padding: 60,
            nodeRepulsion: 22000,
            idealEdgeLength: 170,
            edgeElasticity: 110,
            gravity: 0.22,
            nestingFactor: 0.9,
            componentSpacing: 180,
            nodeOverlap: 20,
            randomize: false
          }
        });

        cyRef.current = instance;
        setPayload(graphPayload);
        setZoomLevel(instance.zoom());

        instance.on("zoom", () => {
          if (!instance) {
            return;
          }
          const currentZoom = instance.zoom();
          setZoomLevel(currentZoom);
          if (selectedNodeIdRef.current) {
            updateFocusClasses(instance, selectedNodeIdRef.current, currentZoom);
          }
        });

        instance.on("tap", "node", (event) => {
          const nextId = String(event.target.id());
          selectedNodeIdRef.current = nextId;
          setSelectedNodeId(nextId);
          instance?.animate(
            {
              fit: {
                eles: event.target.closedNeighborhood(),
                padding: 110
              }
            },
            {
              duration: 320
            }
          );
        });

        const initialNode = graphPayload.nodes.find((node) => node.id === id) ?? graphPayload.nodes[0] ?? null;
        if (initialNode) {
          selectedNodeIdRef.current = initialNode.id;
          setSelectedNodeId(initialNode.id);
          await loadInspector(initialNode, graphPayload);
          updateFocusClasses(instance, initialNode.id, instance.zoom());
        }
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Graph load failed");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
      cyRef.current = null;
      instance?.destroy();
    };
  }, [scope, id]);

  useEffect(() => {
    if (!payload || !selectedNode) {
      return;
    }

    selectedNodeIdRef.current = selectedNode.id;
    void loadInspector(selectedNode, payload);
    if (cyRef.current) {
      updateFocusClasses(cyRef.current, selectedNode.id, zoomLevel);
    }
  }, [payload, selectedNode, zoomLevel]);

  async function loadInspector(node: GraphPayload["nodes"][number], graphPayload: GraphPayload) {
    setInspectorLoading(true);
    try {
      const neighbors = describeNeighbors(node.id, graphPayload);

      if (node.type === "issue") {
        const detail = await getJson<IssueDetail>(`/api/issues/${node.id}`);
        setInspector({
          title: detail.title,
          subtitle: `${detail.paths.length} 条进路`,
          summary: detail.summary,
          chips: detail.terms.map((term) => term.label),
          bullets: [
            `${detail.timeline.length} 个时间节点`,
            `${new Set(detail.geo.nodes.map((item) => item.region)).size} 个区域`,
            `${detail.paths.length} 条解释分流`
          ],
          neighbors,
          outlineTitle: "如何继续深究",
          outline: [
            "放大到 1.15x 左右，先看一级路径与代表学者如何围绕核心问题展开。",
            "继续放大到 1.45x 以上，二级分支会进一步加深，便于看见支路论文与术语组合。",
            "可回到右侧人物面板，对照不同流派的代表学者和论文摘要。"
          ]
        });
        return;
      }

      if (node.type === "scholar") {
        const detail = await getJson<ScholarDetail>(`/api/scholars/${node.id}`);
        setInspector({
          title: detail.nameZh ?? detail.name,
          subtitle: `${detail.institution} · ${detail.region}`,
          summary: detail.biography,
          chips: detail.terms.map((term) => term.label),
          bullets: [
            `${detail.works.length} 篇代表作`,
            `${detail.relatedScholars.length} 位直接相关学者`,
            `${detail.branchScholars.length} 位分支学者`
          ],
          neighbors,
          outlineTitle: "阅读路径",
          outline: [
            "先看此学者连接到哪些研究进路，再沿着工作节点进入论文摘要。",
            "如果二级支路颜色加深，说明已经进入更细一级的影响链或同路分支。",
            "相关人物与分支学者可用于追踪中文和海外研究之间的传递关系。"
          ]
        });
        return;
      }

      if (node.type === "work") {
        const detail = await getJson<WorkDetail>(`/api/works/${node.id}`);
        setInspector({
          title: detail.titleZh ?? detail.title,
          subtitle: `${detail.year} · ${detail.venue}`,
          summary: detail.abstract ?? "No abstract is available for this work yet.",
          chips: detail.relatedTerms.map((term) => term.label),
          bullets: [
            `作者: ${detail.authors.join(" / ")}`,
            `来源: ${detail.cnkiId ? "CNKI" : detail.source}`,
            detail.doi ? `DOI: ${detail.doi}` : "DOI unavailable"
          ],
          neighbors,
          outlineTitle: "摘要拆解",
          outline: detail.argumentOutline
        });
        return;
      }

      if (node.type === "term") {
        const detail = await getJson<TermDetail>(`/api/terms/${node.id}`);
        setInspector({
          title: detail.label,
          subtitle: detail.sep?.title ?? "Term node",
          summary: `${detail.gloss} ${detail.sep?.summary ?? ""}`.trim(),
          chips: detail.relatedIssues.map((issue) => issue.label),
          bullets: [
            `${detail.relatedScholars.length} 位相关学者`,
            `${detail.relatedWorkCount} 篇相关论文`,
            detail.sep?.url ? "含 SEP 链接" : "暂无 SEP 链接"
          ],
          neighbors,
          outlineTitle: "术语进入方式",
          outline: [
            "术语节点适合用来反查它连接了哪些问题、人物和论文。",
            "如果从论文节点放大到术语节点，可以把摘要中的关键词直接落回概念史脉络。",
            "在主视图悬停术语，也能看到简短介绍与 SEP 摘要。"
          ]
        });
        return;
      }

      setInspector({
        title: node.label,
        subtitle: node.meta ?? "Path node",
        summary: "路径节点用于组织同一问题下的研究分流。放大后可以更清楚地看到代表学者、关键论文和术语如何围绕它排开。",
        chips: [],
        bullets: ["适合比较不同流派", "可与右侧 scholar detail 联动", "放大后显露更深一层关系"],
        neighbors,
        outlineTitle: "观察重点",
        outline: [
          "先看它与问题节点的距离，判断这是主干还是支路。",
          "再看路径下的代表学者和工作节点，比较其术语组合。",
          "如果二级节点变深，说明已经进入具体论文和次级影响链。"
        ]
      });
    } finally {
      setInspectorLoading(false);
    }
  }

  function animateZoom(direction: "in" | "out") {
    const instance = cyRef.current;
    if (!instance) {
      return;
    }

    const currentZoom = instance.zoom();
    const nextZoom = direction === "in" ? Math.min(2.4, currentZoom + 0.22) : Math.max(0.74, currentZoom - 0.22);
    const focus = selectedNodeId ? instance.$id(selectedNodeId) : instance.elements();

    instance.animate(
      {
        zoom: nextZoom,
        center: { eles: focus }
      },
      {
        duration: 320
      }
    );
  }

  return (
    <div className="grid h-full gap-4 lg:grid-cols-[minmax(0,1.35fr)_320px]">
      <div className="relative h-[420px] overflow-hidden rounded-xl border border-line/70 bg-white/80 lg:h-full">
        <div ref={rootRef} className="h-full w-full" />
        <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full border border-line/70 bg-white/90 px-2 py-1 text-xs text-slate-600 shadow-panel">
          <button
            type="button"
            onClick={() => animateZoom("out")}
            className="grid h-7 w-7 place-items-center rounded-full border border-line/70 transition hover:border-accent hover:text-accent"
          >
            -
          </button>
          <span className="min-w-12 text-center">{zoomLevel.toFixed(2)}x</span>
          <button
            type="button"
            onClick={() => animateZoom("in")}
            className="grid h-7 w-7 place-items-center rounded-full border border-line/70 transition hover:border-accent hover:text-accent"
          >
            +
          </button>
        </div>
        <div className="absolute left-3 top-3 rounded-full border border-line/70 bg-white/90 px-3 py-1 text-xs text-slate-600 shadow-panel">
          {getZoomHint(zoomLevel)}
        </div>
        {loading ? <div className="absolute inset-0 grid place-items-center text-sm text-accent">Loading graph...</div> : null}
        {error ? <div className="absolute inset-x-4 bottom-4 rounded-full bg-white/90 px-4 py-2 text-sm text-rose-700">{error}</div> : null}
      </div>

      <aside className="rounded-xl border border-line/70 bg-canvas/65 p-4">
        <div className="text-xs uppercase tracking-[0.16em] text-accentSoft">Node Inspector</div>
        {inspectorLoading ? <div className="mt-4 text-sm text-accent">Loading node detail...</div> : null}
        {inspector ? (
          <div className="mt-4">
            <h5 className="text-xl font-semibold text-ink">{inspector.title}</h5>
            <div className="mt-2 text-sm text-accent">{inspector.subtitle}</div>
            <p className="mt-4 text-sm leading-7 text-slate-700">{inspector.summary}</p>
            {inspector.chips.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {inspector.chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-line/70 bg-white/90 px-3 py-1 text-xs text-accent">
                    {chip}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="mt-5 space-y-2 text-sm text-slate-600">
              {inspector.bullets.map((bullet) => (
                <div key={bullet} className="rounded-xl border border-line/60 bg-white/85 px-3 py-2">
                  {bullet}
                </div>
              ))}
            </div>
            {inspector.outline?.length ? (
              <div className="mt-5">
                <div className="text-sm font-medium text-accent">{inspector.outlineTitle ?? "延伸说明"}</div>
                <div className="mt-2 space-y-2 text-sm text-slate-700">
                  {inspector.outline.map((item) =>
                    typeof item === "string" ? (
                      <div key={item} className="rounded-xl border border-line/60 bg-white/85 px-3 py-2">
                        {item}
                      </div>
                    ) : (
                      <div key={`${item.label}-${item.detail}`} className="rounded-xl border border-line/60 bg-white/85 px-3 py-2">
                        <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-accentSoft">{item.label}</div>
                        <div className="mt-1 leading-6">{item.detail}</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : null}
            <div className="mt-5">
              <div className="text-sm font-medium text-accent">Nearby nodes</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {inspector.neighbors.map((neighbor) => (
                  <span key={neighbor} className="rounded-full bg-white px-3 py-1 text-xs text-slate-700">
                    {neighbor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-slate-600">Choose a node to inspect its nearby structure and supporting detail.</div>
        )}
      </aside>
    </div>
  );
}

function updateFocusClasses(instance: cytoscape.Core, focusId: string, zoomLevel: number) {
  instance.elements().removeClass(["focused", "dimmed", "focus-edge", ...HOP_CLASS_NAMES].join(" "));
  if (!focusId) {
    return;
  }

  const focus = instance.$id(focusId);
  if (!focus.length) {
    return;
  }

  const { nodesByDepth, edgesByDepth, maxDepth } = collectHopLayers(instance, focusId);
  const visibleDepth = getVisibleHopDepth(zoomLevel, maxDepth);

  if (visibleDepth === 0) {
    instance.elements().difference(focus).addClass("dimmed");
    focus.addClass("focused");
    return;
  }

  let visible = focus;
  for (let depth = 1; depth <= visibleDepth; depth += 1) {
    visible = visible
      .union(nodesByDepth.get(depth) ?? instance.collection())
      .union(edgesByDepth.get(depth) ?? instance.collection());
  }

  instance.elements().difference(visible).addClass("dimmed");
  focus.addClass("focused");

  for (let depth = 1; depth <= visibleDepth; depth += 1) {
    const hopNodes = nodesByDepth.get(depth);
    const hopEdges = edgesByDepth.get(depth);

    if (hopNodes?.length) {
      hopNodes.addClass(getHopNodeClass(depth));
    }

    if (hopEdges?.length) {
      hopEdges.addClass(depth === 1 && visibleDepth === 1 ? "focus-edge" : getHopEdgeClass(depth));
    }
  }
}

function collectHopLayers(instance: cytoscape.Core, focusId: string) {
  const nodeDepth = new Map<string, number>([[focusId, 0]]);
  const queue = [focusId];

  while (queue.length) {
    const currentId = queue.shift();
    if (!currentId) {
      continue;
    }

    const currentDepth = nodeDepth.get(currentId) ?? 0;
    instance
      .$id(currentId)
      .connectedEdges()
      .forEach((edge) => {
        const sourceId = edge.source().id();
        const targetId = edge.target().id();
        const nextId = sourceId === currentId ? targetId : sourceId;

        if (!nodeDepth.has(nextId)) {
          nodeDepth.set(nextId, currentDepth + 1);
          queue.push(nextId);
        }
      });
  }

  const nodesByDepth = new Map<number, cytoscape.CollectionReturnValue>();
  const edgesByDepth = new Map<number, cytoscape.CollectionReturnValue>();
  let maxDepth = 0;

  nodeDepth.forEach((depth, nodeId) => {
    if (depth === 0) {
      return;
    }

    maxDepth = Math.max(maxDepth, depth);
    const currentCollection = nodesByDepth.get(depth) ?? instance.collection();
    nodesByDepth.set(depth, currentCollection.union(instance.$id(nodeId)));
  });

  instance.edges().forEach((edge) => {
    const sourceDepth = nodeDepth.get(edge.source().id());
    const targetDepth = nodeDepth.get(edge.target().id());
    if (sourceDepth == null || targetDepth == null) {
      return;
    }

    const depth = Math.max(sourceDepth, targetDepth);
    if (depth === 0) {
      return;
    }

    const currentCollection = edgesByDepth.get(depth) ?? instance.collection();
    edgesByDepth.set(depth, currentCollection.union(edge));
  });

  return { nodesByDepth, edgesByDepth, maxDepth };
}

function getVisibleHopDepth(zoomLevel: number, maxDepth: number) {
  if (!maxDepth) {
    return 0;
  }

  let visibleDepth = 0;
  for (const layer of HOP_LAYER_STYLES) {
    if (zoomLevel >= layer.threshold) {
      visibleDepth += 1;
    }
  }

  if (visibleDepth >= HOP_LAYER_STYLES.length) {
    return maxDepth;
  }

  return Math.min(visibleDepth, maxDepth);
}

function getHopNodeClass(depth: number) {
  return HOP_LAYER_STYLES[depth - 1]?.nodeClass ?? FAR_HOP_NODE_CLASS;
}

function getHopEdgeClass(depth: number) {
  return HOP_LAYER_STYLES[depth - 1]?.edgeClass ?? FAR_HOP_EDGE_CLASS;
}

function getZoomHint(zoomLevel: number) {
  for (let index = HOP_LAYER_STYLES.length - 1; index >= 0; index -= 1) {
    if (zoomLevel >= HOP_LAYER_STYLES[index].threshold) {
      return HOP_LAYER_STYLES[index].label;
    }
  }

  return "放大后展开更多关系";
}

function describeNeighbors(nodeId: string, payload: GraphPayload) {
  const neighborIds = payload.edges.flatMap((edge) => {
    if (edge.source === nodeId) {
      return [edge.target];
    }
    if (edge.target === nodeId) {
      return [edge.source];
    }
    return [];
  });

  return [...new Set(neighborIds)]
    .map((neighborId) => payload.nodes.find((node) => node.id === neighborId)?.label)
    .filter((label): label is string => Boolean(label));
}
