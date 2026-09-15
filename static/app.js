
const data = {
  philosopher: {
    label: "康德",
    name: "Immanuel Kant",
    lifespan: "1724-1804",
    overview: "以康德为核心组织近几十年的主要研究问题、解释进路、研究者网络与代表论文，强调时间演化、全球传播与术语外链。"
  },
  sourceRecords: [
    { provider: "curated", status: "ready", note: "主要问题、研究进路、术语映射与人物关系由策展数据维护。" },
    { provider: "cnki", status: "fallback", note: "中文论文元数据预留 CNKI 受限实时层，首版以补录与缓存兜底。" },
    { provider: "openalex", status: "fallback", note: "公开学术元数据接口位已预留，用于后续刷新论文信息。" },
    { provider: "crossref", status: "fallback", note: "Crossref 用于 DOI 和刊物补全，当前由站内数据模拟。" }
  ],
  terms: {
    ti: { id: "ti", label: "先验唯心论", sep: "https://plato.stanford.edu/entries/kant-transcendental-idealism/" },
    autonomy: { id: "autonomy", label: "自律", sep: "https://plato.stanford.edu/entries/kant-moral/" },
    meta: { id: "meta", label: "形而上学批判", sep: "https://plato.stanford.edu/entries/kant-metaphysics/" },
    judgment: { id: "judgment", label: "判断力", sep: "https://plato.stanford.edu/entries/kant-aesthetics/" },
    self: { id: "self", label: "统觉", sep: "https://plato.stanford.edu/entries/kant-mind/" },
    cosmo: { id: "cosmo", label: "世界公民秩序", sep: "https://plato.stanford.edu/entries/kant-social-political/" },
    freedom: { id: "freedom", label: "自由", sep: "https://plato.stanford.edu/entries/kant-free-will/" },
    thing: { id: "thing", label: "物自身", sep: "https://plato.stanford.edu/entries/kant-transcendental-idealism/#ThinItse" }
  },
  issues: [
    { id: "issue-ti", label: "先验唯心论", title: "先验唯心论与物自身", summary: "围绕现象、物自身与经验客观性的解释路线，是康德研究中最持续的高频核心。", weight: 96, terms: ["ti", "thing"] },
    { id: "issue-moral", label: "道德自律", title: "自律、义务与实践理性", summary: "集中讨论道德法则、自由意志与实践理性如何联通康德整体体系。", weight: 92, terms: ["autonomy", "freedom"] },
    { id: "issue-meta", label: "形而上学", title: "批判与形而上学重建", summary: "讨论批判哲学对形而上学的限制与重建。", weight: 86, terms: ["meta", "thing"] },
    { id: "issue-judgment", label: "判断力", title: "审美、目的论与第三批判", summary: "近几十年大量研究聚焦第三批判如何连接自然与自由。", weight: 78, terms: ["judgment"] },
    { id: "issue-self", label: "自我意识", title: "统觉、自我意识与心灵结构", summary: "从分析哲学与德国观念论两端重新审视统觉与主体统一。", weight: 74, terms: ["self", "ti"] },
    { id: "issue-history", label: "历史与全球秩序", title: "历史哲学、法权与世界公民视野", summary: "围绕康德历史目的论、永久和平与全球正义的再阐释。", weight: 70, terms: ["cosmo", "freedom"] }
  ],
  paths: [
    { id: "path-two-aspect", issueId: "issue-ti", label: "双重视角解释", stance: "重释先验唯心论的一致性", summary: "把现象与物自身理解为同一对象在不同立场下的两种把握。", highlights: ["弱化二世界论", "强调认识条件", "连接当代实在论争论"], scholars: ["allison", "langton", "allais"] },
    { id: "path-modest-reading", issueId: "issue-ti", label: "温和实在论读法", stance: "提升物自身与经验世界的兼容性", summary: "保持康德经验实在性，同时抵抗将康德读成纯主观主义。", highlights: ["重估物自身功能", "衔接形而上学问题"], scholars: ["ameriks", "stern"] },
    { id: "path-constructivism", issueId: "issue-moral", label: "建构主义伦理学", stance: "将康德伦理学转化为当代规范理论资源", summary: "从自律出发，把规范性理解为实践主体的自我立法结构。", highlights: ["实践身份", "公共理性", "规范的可辩护性"], scholars: ["korsgaard", "oneill", "wood"] },
    { id: "path-freedom-antinomy", issueId: "issue-moral", label: "自由与二律背反", stance: "强调自由问题的体系核心地位", summary: "从自由概念与二律背反切入，重读实践理性与理论理性的接口。", highlights: ["自由的可思性", "实践优位"], scholars: ["guyer", "willaschek"] },
    { id: "path-revisionary-metaphysics", issueId: "issue-meta", label: "修正性形而上学", stance: "重建而非废除形而上学", summary: "认为康德不是终结形而上学，而是对其对象与方法进行批判重建。", highlights: ["体系性回归", "先验论证重估"], scholars: ["pippin", "willaschek"] },
    { id: "path-analytic-critique", issueId: "issue-meta", label: "分析重构路线", stance: "细化论证层次与概念边界", summary: "利用分析哲学的清晰区分来重建批判哲学的论证结构。", highlights: ["论证图谱化", "知识条件建模"], scholars: ["stern", "longuenesse"] },
    { id: "path-bridge-third-critique", issueId: "issue-judgment", label: "第三批判桥梁论", stance: "把第三批判置于体系枢纽位置", summary: "将审美与目的论视为连接自然与自由的中介机制。", highlights: ["体系连接", "自然与自由过渡"], scholars: ["guyer", "longuenesse"] },
    { id: "path-aesthetic-normativity", issueId: "issue-judgment", label: "审美规范性路线", stance: "把审美判断置入公共理性和规范性框架", summary: "从共同感与可传达性讨论审美判断的规范结构。", highlights: ["共同感", "审美公共性"], scholars: ["allais", "oneill"] },
    { id: "path-unity-apperception", issueId: "issue-self", label: "统觉统一性", stance: "把主体统一性看作经验客观性的条件", summary: "从心灵架构与表象综合说明我思如何伴随经验。", highlights: ["综合活动", "主体同一性"], scholars: ["longuenesse", "gardner"] },
    { id: "path-post-kantian-self", issueId: "issue-self", label: "后康德主体性扩展", stance: "把康德视为现代主体性理论的开端", summary: "从费希特与黑格尔回看康德自我意识结构的未完成性。", highlights: ["主体活动性", "历史化主体"], scholars: ["pippin", "gardner"] },
    { id: "path-cosmopolitan-right", issueId: "issue-history", label: "世界公民法权", stance: "将康德带入当代全球正义争论", summary: "从法权、永久和平与全球制度角度重读康德政治哲学。", highlights: ["全球制度", "公共法权"], scholars: ["oneill", "wood"] },
    { id: "path-historical-teleology", issueId: "issue-history", label: "历史目的论重估", stance: "在历史哲学与政治判断之间寻找新平衡", summary: "讨论历史进步叙事、反思性判断与政治现实主义之间的张力。", highlights: ["历史进步", "全球视角"], scholars: ["ameriks", "willaschek"] }
  ],
  scholars: {
    allison: { id: "allison", name: "Henry E. Allison", nameZh: "亨利·艾利森", region: "北美", institution: "UC Davis", summary: "双重视角解释的关键奠基者，系统影响英美康德研究。", biography: "艾利森的工作重塑了英美世界对先验唯心论的理解，强调经验实在论与先验理想性的兼容。", terms: ["ti", "thing", "freedom"], issues: ["issue-ti", "issue-moral"], paths: ["path-two-aspect"], works: ["allison-2004", "allison-1990"], sep: "https://plato.stanford.edu/entries/kant-transcendental-idealism/", geo: { x: 23, y: 41 } },
    ameriks: { id: "ameriks", name: "Karl Ameriks", nameZh: "卡尔·阿默里克斯", region: "北美", institution: "University of Notre Dame", summary: "温和实在论与历史化康德研究的重要代表。", biography: "阿默里克斯兼顾解释学与思想史，反对把康德彻底化约为主观建构论者。", terms: ["ti", "cosmo", "thing"], issues: ["issue-ti", "issue-history"], paths: ["path-modest-reading", "path-historical-teleology"], works: ["ameriks-2000", "ameriks-2012"], geo: { x: 24, y: 40 } },
    oneill: { id: "oneill", name: "Onora O'Neill", nameZh: "奥诺拉·奥尼尔", region: "英国", institution: "University of Cambridge", summary: "将康德自律与公共理性推进到当代伦理和政治理论。", biography: "奥尼尔的康德研究横跨伦理学与政治哲学，尤其强调公开可辩护性与制度理性。", terms: ["autonomy", "cosmo"], issues: ["issue-moral", "issue-history", "issue-judgment"], paths: ["path-constructivism", "path-aesthetic-normativity", "path-cosmopolitan-right"], works: ["oneill-1989", "oneill-2000"], geo: { x: 47, y: 31 } },
    wood: { id: "wood", name: "Allen W. Wood", nameZh: "艾伦·伍德", region: "北美", institution: "Indiana University", summary: "在康德伦理学与政治哲学之间建立持续桥接。", biography: "伍德强调康德自由概念与政治法权的互相支撑，并推动其面向当代正义理论。", terms: ["autonomy", "freedom", "cosmo"], issues: ["issue-moral", "issue-history"], paths: ["path-constructivism", "path-cosmopolitan-right"], works: ["wood-1999"], geo: { x: 25, y: 40 } },
    guyer: { id: "guyer", name: "Paul Guyer", nameZh: "保罗·盖耶", region: "北美", institution: "Brown University", summary: "横跨三大批判的体系型研究者。", biography: "盖耶既研究审美判断，也研究自由和体系统一，是图谱中的高连接节点。", terms: ["judgment", "freedom"], issues: ["issue-moral", "issue-judgment"], paths: ["path-freedom-antinomy", "path-bridge-third-critique"], works: ["guyer-2005", "guyer-1987"], geo: { x: 28, y: 39 } },
    longuenesse: { id: "longuenesse", name: "Beatrice Longuenesse", nameZh: "贝娅特丽斯·隆格内斯", region: "法国/北美", institution: "New York University", summary: "统觉、判断与自我意识研究的高影响力学者。", biography: "隆格内斯从心灵哲学与知识论视角重审康德统觉与判断，使其与当代哲学对话。", terms: ["self", "judgment"], issues: ["issue-meta", "issue-judgment", "issue-self"], paths: ["path-analytic-critique", "path-bridge-third-critique", "path-unity-apperception"], works: ["longuenesse-1998", "longuenesse-2007"], geo: { x: 40, y: 34 } },
    pippin: { id: "pippin", name: "Robert B. Pippin", nameZh: "罗伯特·皮平", region: "北美", institution: "University of Chicago", summary: "从德国观念论回看康德体系性的关键人物。", biography: "皮平把康德放入现代性与自我立法的大图景中，尤其强调后康德展开。", terms: ["self", "meta", "autonomy"], issues: ["issue-meta", "issue-self"], paths: ["path-revisionary-metaphysics", "path-post-kantian-self"], works: ["pippin-2005"], geo: { x: 25, y: 39 } },
    korsgaard: { id: "korsgaard", name: "Christine M. Korsgaard", nameZh: "克里斯汀·科斯加德", region: "北美", institution: "Harvard University", summary: "康德建构主义伦理学的最强当代表述者之一。", biography: "科斯加德通过实践身份和自我构成概念扩展了康德道德哲学的当代生命力。", terms: ["autonomy", "freedom"], issues: ["issue-moral"], paths: ["path-constructivism"], works: ["korsgaard-1996"], geo: { x: 29, y: 38 } },
    langton: { id: "langton", name: "Rae Langton", nameZh: "蕾·兰顿", region: "英国", institution: "University of Cambridge", summary: "将康德物自身问题与当代形而上学连接起来。", biography: "兰顿以谦逊解释著名，其工作在英美世界重新点燃物自身争论。", terms: ["thing", "ti", "judgment"], issues: ["issue-ti", "issue-judgment"], paths: ["path-two-aspect", "path-aesthetic-normativity"], works: ["langton-1998"], geo: { x: 47, y: 31 } },
    stern: { id: "stern", name: "Robert Stern", nameZh: "罗伯特·斯特恩", region: "英国", institution: "University of Sheffield", summary: "在分析与德哲之间做桥接。", biography: "斯特恩既关注严格论证，也关注体系历史，常在康德与黑格尔之间往返。", terms: ["meta", "ti"], issues: ["issue-ti", "issue-meta"], paths: ["path-modest-reading", "path-analytic-critique"], works: ["stern-2000"], geo: { x: 46, y: 31 } },
    willaschek: { id: "willaschek", name: "Marcus Willaschek", nameZh: "马库斯·维拉舍克", region: "德国", institution: "Goethe University Frankfurt", summary: "将理性批判、自由问题与形而上学论证精细化。", biography: "维拉舍克常以论证地图方式重组《纯粹理性批判》，适合与时间轴和图谱视图联动。", terms: ["freedom", "meta", "cosmo"], issues: ["issue-moral", "issue-meta", "issue-history"], paths: ["path-freedom-antinomy", "path-revisionary-metaphysics", "path-historical-teleology"], works: ["willaschek-2018", "willaschek-2023"], geo: { x: 52, y: 29 } },
    allais: { id: "allais", name: "Lucy Allais", nameZh: "露西·阿莱", region: "英国/南非", institution: "Johns Hopkins University", summary: "在知觉、审美与先验唯心论之间形成细腻的新解释。", biography: "阿莱擅长在文本解释和当代哲学之间保持平衡，尤其处理对象性与感受性的关系。", terms: ["ti", "judgment"], issues: ["issue-ti", "issue-judgment"], paths: ["path-two-aspect", "path-aesthetic-normativity"], works: ["allais-2015"], geo: { x: 33, y: 36 } },
    gardner: { id: "gardner", name: "Sebastian Gardner", nameZh: "塞巴斯蒂安·加德纳", region: "英国", institution: "University College London", summary: "在自我意识、自由与后康德问题上保持高影响力。", biography: "加德纳兼顾文本解释与体系问题，尤其关注康德与德国观念论之间的过渡结构。", terms: ["self", "freedom"], issues: ["issue-self"], paths: ["path-unity-apperception", "path-post-kantian-self"], works: ["gardner-1999"], geo: { x: 47, y: 31 } }
  },
  works: {
    "allison-2004": { id: "allison-2004", title: "Kant's Transcendental Idealism", titleZh: "康德的先验唯心论", year: 2004, venue: "Yale University Press", source: "cnki", doi: "10.12987/yale/9780300102663.001.0001", cnkiId: "CNKI:SUN:WGZX.0.2006-02-014", abstract: "双重视角解释的代表性著作，系统重写英美康德先验唯心论讨论。", terms: ["ti", "thing"], scholars: ["allison"] },
    "allison-1990": { id: "allison-1990", title: "Kant's Theory of Freedom", titleZh: "康德的自由理论", year: 1990, venue: "Cambridge University Press", source: "openalex", doi: "10.1017/CBO9781139173534", cnkiId: null, abstract: "将自由问题放回第一、二批判之间的体系关联中。", terms: ["freedom", "autonomy"], scholars: ["allison"] },
    "ameriks-2000": { id: "ameriks-2000", title: "Kant and the Fate of Autonomy", titleZh: "康德与自律的命运", year: 2000, venue: "Cambridge University Press", source: "openalex", doi: "10.1017/CBO9780511487306", cnkiId: null, abstract: "从思想史角度讨论康德自律概念的后续命运。", terms: ["autonomy", "cosmo"], scholars: ["ameriks"] },
    "ameriks-2012": { id: "ameriks-2012", title: "Kant's Elliptical Path", titleZh: "康德的椭圆路径", year: 2012, venue: "Oxford University Press", source: "crossref", doi: "10.1093/acprof:oso/9780199693693.001.0001", cnkiId: null, abstract: "把康德放入历史目的论与观念论生成的长时段路径中。", terms: ["cosmo", "ti"], scholars: ["ameriks"] },
    "oneill-1989": { id: "oneill-1989", title: "Constructions of Reason", titleZh: "理性的建构", year: 1989, venue: "Cambridge University Press", source: "openalex", doi: "10.1017/CBO9780511609043", cnkiId: null, abstract: "将康德伦理学与公共理性重新接到当代规范理论。", terms: ["autonomy", "cosmo"], scholars: ["oneill"] },
    "oneill-2000": { id: "oneill-2000", title: "Bounds of Justice", titleZh: "正义的边界", year: 2000, venue: "Cambridge University Press", source: "cnki", doi: "10.1017/CBO9780511487511", cnkiId: "CNKI:SUN:ZJZX.0.2004-03-018", abstract: "从康德立场讨论全球正义与制度约束的边界。", terms: ["cosmo", "autonomy"], scholars: ["oneill"] },
    "wood-1999": { id: "wood-1999", title: "Kant's Ethical Thought", titleZh: "康德的伦理思想", year: 1999, venue: "Cambridge University Press", source: "openalex", doi: "10.1017/CBO9781139173275", cnkiId: null, abstract: "康德伦理学标准导论之一。", terms: ["autonomy", "freedom"], scholars: ["wood"] },
    "guyer-2005": { id: "guyer-2005", title: "Kant's System of Nature and Freedom", titleZh: "康德的自然与自由体系", year: 2005, venue: "Oxford University Press", source: "openalex", doi: "10.1093/0199273474.001.0001", cnkiId: null, abstract: "把自然与自由的体系联系放回三大批判的整体结构。", terms: ["freedom", "judgment"], scholars: ["guyer"] },
    "guyer-1987": { id: "guyer-1987", title: "Kant and the Claims of Taste", titleZh: "康德与趣味的主张", year: 1987, venue: "Harvard University Press", source: "openalex", doi: null, cnkiId: null, abstract: "把第三批判中的审美判断纳入系统结构。", terms: ["judgment"], scholars: ["guyer"] },
    "longuenesse-1998": { id: "longuenesse-1998", title: "Kant and the Capacity to Judge", titleZh: "康德与判断能力", year: 1998, venue: "Princeton University Press", source: "openalex", doi: null, cnkiId: null, abstract: "围绕范畴、图式与判断活动重写康德认识论。", terms: ["judgment", "self"], scholars: ["longuenesse"] },
    "longuenesse-2007": { id: "longuenesse-2007", title: "Kant on the Human Standpoint", titleZh: "康德论人的立场", year: 2007, venue: "Cambridge University Press", source: "crossref", doi: "10.1017/CBO9780511497954", cnkiId: null, abstract: "从自我意识与第一人称立场重解康德心灵哲学。", terms: ["self"], scholars: ["longuenesse"] },
    "pippin-2005": { id: "pippin-2005", title: "The Persistence of Subjectivity", titleZh: "主体性的持续性", year: 2005, venue: "Cambridge University Press", source: "crossref", doi: "10.1017/CBO9780511614412", cnkiId: null, abstract: "把康德主体性问题置于现代性与规范性争论中心。", terms: ["self", "autonomy"], scholars: ["pippin"] },
    "korsgaard-1996": { id: "korsgaard-1996", title: "The Sources of Normativity", titleZh: "规范性的来源", year: 1996, venue: "Cambridge University Press", source: "openalex", doi: "10.1017/CBO9780511554473", cnkiId: null, abstract: "从康德自律出发提出实践身份和规范性的当代建构主义框架。", terms: ["autonomy", "freedom"], scholars: ["korsgaard"] },
    "langton-1998": { id: "langton-1998", title: "Kantian Humility", titleZh: "康德式谦逊", year: 1998, venue: "Oxford University Press", source: "openalex", doi: null, cnkiId: null, abstract: "把物自身解释为对象本有性质的不可知性。", terms: ["thing", "ti"], scholars: ["langton"] },
    "stern-2000": { id: "stern-2000", title: "Transcendental Arguments and Scepticism", titleZh: "先验论证与怀疑论", year: 2000, venue: "Oxford University Press", source: "crossref", doi: "10.1093/0199248348.001.0001", cnkiId: null, abstract: "用分析方法重建先验论证与经验客观性的关系。", terms: ["meta", "ti"], scholars: ["stern"] },
    "willaschek-2018": { id: "willaschek-2018", title: "Kant on the Sources of Metaphysics", titleZh: "康德论形而上学的来源", year: 2018, venue: "Cambridge University Press", source: "openalex", doi: null, cnkiId: null, abstract: "用精细论证图重建《纯粹理性批判》的形而上学诊断。", terms: ["meta", "freedom"], scholars: ["willaschek"] },
    "willaschek-2023": { id: "willaschek-2023", title: "Kant: The Critique of Pure Reason", titleZh: "康德：《纯粹理性批判》导论", year: 2023, venue: "Princeton University Press", source: "cnki", doi: null, cnkiId: "CNKI:SUN:WGZH.0.2024-01-007", abstract: "新一代导论型研究，适合与站内问题云图和路径层联动。", terms: ["meta", "ti"], scholars: ["willaschek"] },
    "allais-2015": { id: "allais-2015", title: "Manifest Reality", titleZh: "显现的现实", year: 2015, venue: "Oxford University Press", source: "openalex", doi: null, cnkiId: null, abstract: "从知觉与对象呈现问题重解先验唯心论。", terms: ["ti", "judgment"], scholars: ["allais"] },
    "gardner-1999": { id: "gardner-1999", title: "Kant and the Critique of Pure Reason", titleZh: "康德与《纯粹理性批判》", year: 1999, venue: "Routledge", source: "openalex", doi: null, cnkiId: null, abstract: "兼顾文本路线与体系路线的经典导论。", terms: ["self", "ti"], scholars: ["gardner"] }
  },
  relations: [
    { source: "allais", target: "allison", type: "influenced_by", summary: "Allais 延续 Allison 的双重视角背景。" },
    { source: "langton", target: "allison", type: "influenced_by", summary: "Langton 的物自身讨论与 Allison 形成正面交锋。" },
    { source: "korsgaard", target: "oneill", type: "influenced_by", summary: "建构主义伦理学部分承接 O'Neill 的公共理性路径。" },
    { source: "wood", target: "korsgaard", type: "coauthored_with", summary: "两者在康德伦理学共同体中长期对话。" },
    { source: "guyer", target: "longuenesse", type: "coauthored_with", summary: "在判断力与体系连接问题上长期交互。" },
    { source: "pippin", target: "gardner", type: "influenced_by", summary: "后康德主体性问题上形成连续对话。" },
    { source: "willaschek", target: "stern", type: "influenced_by", summary: "论证地图法部分承接 Stern 的先验论证讨论。" },
    { source: "oneill", target: "wood", type: "coauthored_with", summary: "政治哲学与全球正义问题上保持学术共振。" },
    { source: "guyer", target: "allison", type: "influenced_by", summary: "体系统一问题上与 Allison 的自由解释长期互相参照。" }
  ]
};
const bubblePositions = [
  { top: 10, left: 12 }, { top: 8, left: 58 }, { top: 34, left: 30 },
  { top: 38, left: 70 }, { top: 66, left: 16 }, { top: 70, left: 54 }
];
const state = {
  issueId: data.issues[0].id,
  scholarId: data.paths.find((p) => p.issueId === data.issues[0].id).scholars[0],
  mode: "paths",
  workId: null
};
const byId = (id) => document.getElementById(id);
const issueMap = Object.fromEntries(data.issues.map((item) => [item.id, item]));
const pathMap = Object.fromEntries(data.paths.map((item) => [item.id, item]));
const getScholar = (id) => data.scholars[id];
const getWork = (id) => data.works[id];
const getTerm = (id) => data.terms[id];
const issuePaths = (issueId) => data.paths.filter((item) => item.issueId === issueId);
const scholarRelations = (scholarId) => data.relations.filter((item) => item.source === scholarId || item.target === scholarId).map((item) => ({ ...item, scholar: getScholar(item.source === scholarId ? item.target : item.source) }));
const issueWorkIds = (issueId) => [...new Set(issuePaths(issueId).flatMap((path) => path.scholars.flatMap((sid) => getScholar(sid).works)))];
function issueTimeline(issueId) {
  const grouped = {};
  issueWorkIds(issueId).forEach((wid) => {
    const work = getWork(wid);
    const row = grouped[work.year] || { year: work.year, works: 0, scholars: new Set() };
    row.works += 1;
    work.scholars.forEach((sid) => row.scholars.add(sid));
    grouped[work.year] = row;
  });
  return Object.values(grouped).sort((a, b) => a.year - b.year).map((item) => ({ year: item.year, works: item.works, scholars: item.scholars.size }));
}
function issueGeo(issueId) {
  const scholarIds = [...new Set(issuePaths(issueId).flatMap((path) => path.scholars))];
  return { nodes: scholarIds.map((id) => getScholar(id)), flows: data.relations.filter((item) => scholarIds.includes(item.source) && scholarIds.includes(item.target)) };
}
const formatRelation = (type) => ({ advised_by: "师承", influenced_by: "影响", coauthored_with: "合作" })[type] || type;
const shortSource = (source) => source === "openalex" ? "OpenAlex" : source === "crossref" ? "Crossref" : source === "cnki" ? "CNKI" : source;
function metricCards() {
  const scholarCount = Object.keys(data.scholars).length;
  const workCount = Object.keys(data.works).length;
  const regionCount = new Set(Object.values(data.scholars).map((item) => item.region)).size;
  byId("metrics").innerHTML = [["问题", data.issues.length], ["研究者", scholarCount], ["论文", workCount], ["区域", regionCount]].map(([label, value]) => `<div class="metric-card"><div class="metric-label">${label}</div><div class="metric-value">${value}</div></div>`).join("");
}
function sourceCards() {
  byId("source-records").innerHTML = data.sourceRecords.map((item) => `<div class="source-record"><div class="source-head"><strong>${item.provider}</strong><span class="source-badge">${item.status}</span></div><div class="source-note">${item.note}</div></div>`).join("");
}
function renderCloud() {
  const root = byId("issue-cloud");
  const max = Math.max(...data.issues.map((item) => item.weight));
  root.innerHTML = "";
  data.issues.forEach((issue, index) => {
    const pos = bubblePositions[index % bubblePositions.length];
    const size = 110 + issue.weight / max * 110;
    const works = issueWorkIds(issue.id).length;
    const bubble = document.createElement("button");
    bubble.type = "button";
    bubble.className = `issue-bubble${state.issueId === issue.id ? " active" : ""}`;
    bubble.style.top = pos.top + "%";
    bubble.style.left = pos.left + "%";
    bubble.style.width = size + "px";
    bubble.style.height = size + "px";
    bubble.style.animationDelay = `${index * .18}s`;
    bubble.innerHTML = `<div><div class="issue-label">${issue.label}</div><div class="issue-meta">${works} 篇</div></div>`;
    bubble.addEventListener("click", () => {
      state.issueId = issue.id;
      state.mode = "paths";
      state.scholarId = issuePaths(issue.id)[0].scholars[0];
      render();
    });
    root.appendChild(bubble);
  });
}
function renderDetail() {
  const issue = issueMap[state.issueId];
  const root = byId("detail-stage");
  const terms = issue.terms.map((id) => getTerm(id));
  if (state.mode === "paths") {
    const paths = issuePaths(issue.id);
    root.innerHTML = `<div class="fade-in"><div class="detail-head"><div><div class="section-label">主要问题</div><h3>${issue.title}</h3></div><button class="ghost-btn" id="issue-graph-btn">展开图谱</button></div><p class="detail-copy">${issue.summary}</p><div class="chip-row">${terms.map((term) => `<a class="term-link" target="_blank" rel="noreferrer" href="${term.sep}">${term.label}</a>`).join("")}</div><div class="path-list">${paths.map((path) => {
      const scholars = path.scholars.map((sid) => getScholar(sid));
      const workCount = new Set(scholars.flatMap((scholar) => scholar.works)).size;
      return `<div class="path-card"><div class="path-head"><div><div class="path-title">${path.label}</div><div class="path-stance">${path.stance}</div></div><div class="pill">${scholars.length} 位研究者 · ${workCount} 篇代表作</div></div><div class="path-copy">${path.summary}</div><div class="tag-row">${path.highlights.map((item) => `<span class="chip">${item}</span>`).join("")}</div><div class="scholar-grid">${scholars.map((scholar) => `<button type="button" class="scholar-chip" data-scholar="${scholar.id}"><div class="scholar-name">${scholar.nameZh || scholar.name}</div><div class="scholar-meta">${scholar.institution} · ${scholar.region}</div><div class="scholar-copy">${scholar.summary}</div></button>`).join("")}</div></div>`;
    }).join("")}</div></div>`;
    byId("issue-graph-btn").addEventListener("click", () => openGraph("issue", issue.id, issue.label));
    root.querySelectorAll("[data-scholar]").forEach((node) => node.addEventListener("click", () => { state.scholarId = node.dataset.scholar; renderScholar(); }));
    return;
  }
  if (state.mode === "timeline") {
    const timeline = issueTimeline(issue.id);
    const max = Math.max(...timeline.map((item) => item.works), 1);
    root.innerHTML = `<div class="fade-in"><div class="detail-head"><div><div class="section-label">时间切片</div><h3>研究热度与参与者演化</h3></div><div class="pill">1980 - 2025</div></div><div class="timeline-wrap">${timeline.map((item) => `<div class="timeline-col"><div class="timeline-bar" style="height:${Math.max(16, item.works / max * 180)}px"></div><div class="timeline-year">${item.year}</div><div class="timeline-value">${item.works} / ${item.scholars}</div></div>`).join("")}</div></div>`;
    return;
  }
  const geo = issueGeo(issue.id);
  root.innerHTML = `<div class="fade-in"><div class="detail-head"><div><div class="section-label">全球视野</div><h3>学者分布与跨区域传播</h3></div><div class="pill">关系流动</div></div><div class="geo-stage" id="geo-stage"></div></div>`;
  const geoRoot = byId("geo-stage");
  geo.flows.forEach((flow) => {
    const source = getScholar(flow.source);
    const target = getScholar(flow.target);
    const dx = target.geo.x - source.geo.x;
    const dy = target.geo.y - source.geo.y;
    const width = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const line = document.createElement("div");
    line.className = "flow-line";
    line.style.left = `${source.geo.x}%`;
    line.style.top = `${source.geo.y}%`;
    line.style.width = `${width}%`;
    line.style.transform = `rotate(${angle}deg)`;
    geoRoot.appendChild(line);
  });
  geo.nodes.forEach((scholar) => {
    const node = document.createElement("div");
    node.className = "geo-node";
    node.style.left = `${scholar.geo.x}%`;
    node.style.top = `${scholar.geo.y}%`;
    node.innerHTML = `<div class="geo-label">${scholar.nameZh || scholar.name}</div><div class="geo-meta">${scholar.region}</div>`;
    geoRoot.appendChild(node);
  });
}
function renderScholar() {
  const scholar = getScholar(state.scholarId);
  const related = scholarRelations(scholar.id);
  byId("scholar-panel").innerHTML = `<div class="right-panel-body"><div class="detail-head"><div><div class="eyebrow">Scholar Detail</div><h3>${scholar.nameZh || scholar.name}</h3><div class="subtitle">${scholar.institution} · ${scholar.region}</div></div><button class="ghost-btn" id="scholar-graph-btn">关系图谱</button></div><p class="scholar-bio">${scholar.biography}</p><div class="chip-row">${scholar.terms.map((id) => `<a class="term-link" target="_blank" rel="noreferrer" href="${getTerm(id).sep}">${getTerm(id).label}</a>`).join("")}${scholar.sep ? `<a class="term-link" target="_blank" rel="noreferrer" href="${scholar.sep}">SEP 词条</a>` : ""}</div><div class="soft-card"><div class="section-label">关联问题与进路</div><div class="inline-links">${scholar.issues.map((id) => `<button class="chip" data-issue="${id}">${issueMap[id].label}</button>`).join("")}${scholar.paths.map((id) => `<span class="pill">${pathMap[id].label}</span>`).join("")}</div></div><div class="scroll-area"><div class="section-title">代表论文</div><div class="section-subtitle">点击后展开论文信息与术语联动</div><div class="stack">${scholar.works.map((id) => { const work = getWork(id); return `<button type="button" class="work-item" data-work="${work.id}"><div class="work-top"><div><strong>${work.titleZh || work.title}</strong><div class="small-meta">${work.year} · ${work.venue}</div></div><span class="badge">${shortSource(work.source)}</span></div><div class="small-copy">${work.abstract}</div></button>`; }).join("")}</div><div class="section-title">相关人物</div><div class="section-subtitle">师承、影响与合作脉络</div><div class="stack">${related.map((item) => `<button type="button" class="related-item" data-scholar="${item.scholar.id}"><div class="related-top"><div><strong>${item.scholar.nameZh || item.scholar.name}</strong><div class="small-meta">${item.scholar.institution} · ${item.scholar.region}</div></div><span class="badge">${formatRelation(item.type)}</span></div><div class="small-copy">${item.summary}</div></button>`).join("")}</div></div></div>`;
  byId("scholar-graph-btn").addEventListener("click", () => openGraph("scholar", scholar.id, scholar.nameZh || scholar.name));
  byId("scholar-panel").querySelectorAll("[data-issue]").forEach((node) => node.addEventListener("click", () => { state.issueId = node.dataset.issue; state.mode = "paths"; render(); }));
  byId("scholar-panel").querySelectorAll("[data-work]").forEach((node) => node.addEventListener("click", () => openWork(node.dataset.work)));
  byId("scholar-panel").querySelectorAll("[data-scholar]").forEach((node) => node.addEventListener("click", () => { state.scholarId = node.dataset.scholar; renderScholar(); }));
}
function openWork(workId) {
  state.workId = workId;
  const work = getWork(workId);
  byId("work-title").textContent = work.titleZh || work.title;
  byId("work-meta").textContent = `${work.year} · ${work.venue}`;
  byId("work-abstract").textContent = work.abstract;
  byId("work-terms").innerHTML = work.terms.map((id) => `<a class="term-link" target="_blank" rel="noreferrer" href="${getTerm(id).sep}">${getTerm(id).label}</a>`).join("");
  byId("work-source-grid").innerHTML = [`来源: ${shortSource(work.source)}`, `DOI: ${work.doi || "无"}`, `CNKI: ${work.cnkiId || "无"}`].map((item) => `<div class="meta-box">${item}</div>`).join("");
  byId("work-graph-btn").onclick = () => openGraph("work", work.id, work.titleZh || work.title);
  byId("work-modal").classList.remove("hidden");
}
function closeModal(id) { byId(id).classList.add("hidden"); }
function openGraph(scope, id, title) {
  byId("graph-title").textContent = title;
  drawGraph(scope, id);
  byId("graph-modal").classList.remove("hidden");
}
function buildGraph(scope, id) {
  const nodes = [];
  const edges = [];
  const addNode = (node) => { if (!nodes.find((item) => item.id === node.id)) nodes.push(node); };
  const addEdge = (edge) => { if (!edges.find((item) => item.id === edge.id)) edges.push(edge); };
  if (scope === "issue") {
    const issue = issueMap[id];
    addNode({ id: issue.id, label: issue.label, type: "issue" });
    issuePaths(id).forEach((path) => {
      addNode({ id: path.id, label: path.label, type: "path" });
      addEdge({ id: `${path.id}-${issue.id}`, source: path.id, target: issue.id, label: "属于问题", type: "belongs_to" });
      path.scholars.forEach((sid) => {
        const scholar = getScholar(sid);
        addNode({ id: sid, label: scholar.nameZh || scholar.name, type: "scholar" });
        addEdge({ id: `${sid}-${path.id}`, source: sid, target: path.id, label: "研究者", type: "focuses_on" });
      });
    });
  }
  if (scope === "scholar") {
    const scholar = getScholar(id);
    addNode({ id: scholar.id, label: scholar.nameZh || scholar.name, type: "scholar" });
    scholar.paths.forEach((pid) => {
      addNode({ id: pid, label: pathMap[pid].label, type: "path" });
      addEdge({ id: `${scholar.id}-${pid}`, source: scholar.id, target: pid, label: "研究进路", type: "focuses_on" });
    });
    scholar.works.forEach((wid) => {
      addNode({ id: wid, label: getWork(wid).titleZh || getWork(wid).title, type: "work" });
      addEdge({ id: `${scholar.id}-${wid}`, source: scholar.id, target: wid, label: "代表论文", type: "authored" });
    });
    scholarRelations(id).forEach((rel) => {
      addNode({ id: rel.scholar.id, label: rel.scholar.nameZh || rel.scholar.name, type: "scholar" });
      addEdge({ id: `${id}-${rel.scholar.id}-${rel.type}`, source: id, target: rel.scholar.id, label: formatRelation(rel.type), type: rel.type });
    });
    scholar.terms.forEach((tid) => {
      addNode({ id: tid, label: getTerm(tid).label, type: "term" });
      addEdge({ id: `${scholar.id}-${tid}`, source: scholar.id, target: tid, label: "术语", type: "related_to_sep" });
    });
  }
  if (scope === "work") {
    const work = getWork(id);
    addNode({ id: work.id, label: work.titleZh || work.title, type: "work" });
    work.scholars.forEach((sid) => {
      const scholar = getScholar(sid);
      addNode({ id: sid, label: scholar.nameZh || scholar.name, type: "scholar" });
      addEdge({ id: `${sid}-${work.id}`, source: sid, target: work.id, label: "作者", type: "authored" });
    });
    work.terms.forEach((tid) => {
      addNode({ id: tid, label: getTerm(tid).label, type: "term" });
      addEdge({ id: `${work.id}-${tid}`, source: work.id, target: tid, label: "术语", type: "mentions_term" });
    });
  }
  return { nodes, edges };
}
function drawGraph(scope, id) {
  const svg = byId("graph-svg");
  const { nodes, edges } = buildGraph(scope, id);
  const cx = 500, cy = 280, radius = Math.min(220, 80 + nodes.length * 10);
  const layout = nodes.map((node, index) => {
    const angle = Math.PI * 2 * index / Math.max(nodes.length, 1) - Math.PI / 2;
    return { ...node, x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });
  const nodeById = (nodeId) => layout.find((item) => item.id === nodeId);
  svg.innerHTML = `<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#97aca8"></path></marker></defs>${edges.map((edge) => {
    const source = nodeById(edge.source); const target = nodeById(edge.target); if (!source || !target) return "";
    const mx = (source.x + target.x) / 2; const my = (source.y + target.y) / 2;
    return `<g><line class="edge-line ${edge.type}" x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" marker-end="url(#arrow)"></line><text class="edge-label" x="${mx}" y="${my - 6}">${edge.label}</text></g>`;
  }).join("")}${layout.map((node) => {
    const r = node.type === "issue" ? 46 : node.type === "path" ? 42 : node.type === "work" ? 38 : node.type === "term" ? 30 : 34;
    return `<g><circle class="node-circle ${node.type}" cx="${node.x}" cy="${node.y}" r="${r}"></circle><text class="node-label" x="${node.x}" y="${node.y}">${node.label}</text></g>`;
  }).join("")}`;
}
function render() {
  renderCloud();
  renderDetail();
  renderScholar();
  document.querySelectorAll("#mode-switch button").forEach((button) => button.classList.toggle("is-active", button.dataset.mode === state.mode));
}
document.querySelectorAll("#mode-switch button").forEach((button) => button.addEventListener("click", () => { state.mode = button.dataset.mode; renderDetail(); document.querySelectorAll("#mode-switch button").forEach((btn) => btn.classList.toggle("is-active", btn === button)); }));
document.querySelectorAll("[data-close]").forEach((button) => button.addEventListener("click", () => closeModal(button.dataset.close)));
["graph-modal", "work-modal"].forEach((id) => byId(id).addEventListener("click", (event) => { if (event.target.id === id) closeModal(id); }));
metricCards();
sourceCards();
render();
