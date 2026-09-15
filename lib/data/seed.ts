import type { ConceptTerm, PhilosopherSummary, RelationType, SepLink, SourceName } from "@/types/explorer";

export interface SeedIssue {
  id: string;
  label: string;
  title: string;
  summary: string;
  weight: number;
  termIds: string[];
}

export interface SeedPath {
  id: string;
  issueId: string;
  label: string;
  summary: string;
  stance: string;
  scholarIds: string[];
  highlights: string[];
}

export interface SeedScholar {
  id: string;
  slug: string;
  name: string;
  nameZh?: string;
  region: string;
  institution: string;
  eraFocus: string;
  summary: string;
  biography: string;
  tags: string[];
  termIds: string[];
  issueIds: string[];
  pathIds: string[];
  workIds: string[];
  geo: { x: number; y: number };
  sep?: SepLink;
}

export interface SeedWork {
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
  abstract: string;
  url?: string;
  keywords: string[];
  termIds: string[];
  scholarIds: string[];
}

export interface SeedRelation {
  source: string;
  target: string;
  type: RelationType;
  summary: string;
}

export const philosopher: PhilosopherSummary = {
  id: "ph-kant",
  slug: "kant",
  name: "Immanuel Kant",
  label: "康德",
  lifespan: "1724-1804",
  era: "德国古典哲学",
  overview: "以康德为核心组织近几十年的问题、进路、研究者网络与代表论文。"
};

const sepEntries: Record<string, SepLink> = {
  ti: { slug: "transcendental-idealism", title: "Transcendental Idealism", url: "https://plato.stanford.edu/entries/kant-transcendental-idealism/", summary: "先验唯心论核心词条。" },
  autonomy: { slug: "autonomy", title: "Kant's Moral Philosophy", url: "https://plato.stanford.edu/entries/kant-moral/", summary: "自律与道德法则词条。" },
  metaphysics: { slug: "metaphysics", title: "Kant's Metaphysics", url: "https://plato.stanford.edu/entries/kant-metaphysics/", summary: "批判哲学与形而上学。" },
  judgment: { slug: "judgment", title: "Kant's Aesthetics and Teleology", url: "https://plato.stanford.edu/entries/kant-aesthetics/", summary: "审美与目的论判断。" },
  self: { slug: "apperception", title: "Kant's View of the Mind and Consciousness of Self", url: "https://plato.stanford.edu/entries/kant-mind/", summary: "统觉与自我意识。" },
  cosmopolitan: { slug: "cosmopolitanism", title: "Kant's Social and Political Philosophy", url: "https://plato.stanford.edu/entries/kant-social-political/", summary: "历史、法权与世界公民。" },
  freedom: { slug: "freedom", title: "Kant and Free Will", url: "https://plato.stanford.edu/entries/kant-free-will/", summary: "自由与实践理性。" },
  thing: { slug: "thing-in-itself", title: "Kant's Thing in Itself", url: "https://plato.stanford.edu/entries/kant-transcendental-idealism/#ThinItse", summary: "物自身争论。" }
};

export const terms: ConceptTerm[] = [
  { id: "term-ti", label: "先验唯心论", gloss: "现象与物自身区分。", sep: sepEntries.ti },
  { id: "term-autonomy", label: "自律", gloss: "意志为自身立法。", sep: sepEntries.autonomy },
  { id: "term-meta", label: "形而上学批判", gloss: "批判哲学对传统形而上学的重建。", sep: sepEntries.metaphysics },
  { id: "term-judgment", label: "判断力", gloss: "审美与目的论判断。", sep: sepEntries.judgment },
  { id: "term-self", label: "统觉", gloss: "经验统一的主观根基。", sep: sepEntries.self },
  { id: "term-cosmo", label: "世界公民秩序", gloss: "历史进步、法权与全球公共理性。", sep: sepEntries.cosmopolitan },
  { id: "term-freedom", label: "自由", gloss: "实践理性的自我规定。", sep: sepEntries.freedom },
  { id: "term-thing", label: "物自身", gloss: "经验之外的限界概念。", sep: sepEntries.thing }
];

export const issues: SeedIssue[] = [
  { id: "issue-ti", label: "先验唯心论", title: "先验唯心论与物自身", summary: "围绕现象、物自身与经验客观性的解释路线。", weight: 96, termIds: ["term-ti", "term-thing"] },
  { id: "issue-moral", label: "道德自律", title: "自律、义务与实践理性", summary: "讨论道德法则、自由意志与实践理性。", weight: 92, termIds: ["term-autonomy", "term-freedom"] },
  { id: "issue-meta", label: "形而上学", title: "批判与形而上学重建", summary: "讨论批判哲学对形而上学的限制与重建。", weight: 86, termIds: ["term-meta", "term-thing"] },
  { id: "issue-judgment", label: "判断力", title: "审美、目的论与第三批判", summary: "聚焦第三批判如何连接自然与自由。", weight: 78, termIds: ["term-judgment"] },
  { id: "issue-self", label: "自我意识", title: "统觉、自我意识与心灵结构", summary: "分析哲学与德国观念论对统觉的重估。", weight: 74, termIds: ["term-self", "term-ti"] },
  { id: "issue-history", label: "历史与全球秩序", title: "历史哲学、法权与世界公民视野", summary: "围绕历史目的论、永久和平与全球正义。", weight: 70, termIds: ["term-cosmo", "term-freedom"] }
];

export const paths: SeedPath[] = [
  { id: "path-two-aspect", issueId: "issue-ti", label: "双重视角解释", summary: "把现象与物自身理解为同一对象的不同立场。", stance: "重释先验唯心论的一致性", scholarIds: ["sch-allison", "sch-langton", "sch-allais", "sch-liqiuling"], highlights: ["弱化二世界论", "强调认识条件", "连接当代实在论争论"] },
  { id: "path-modest-reading", issueId: "issue-ti", label: "温和实在论读法", summary: "保持经验实在性，抵抗纯主观主义。", stance: "提升物自身与经验世界的兼容性", scholarIds: ["sch-ameriks", "sch-stern", "sch-yangzutao"], highlights: ["重估物自身功能", "衔接形而上学问题"] },
  { id: "path-chinese-textual", issueId: "issue-ti", label: "中国译介与文本勘定", summary: "围绕中文译介、概念史与章节细读组织康德研究的本土问题意识。", stance: "把译介、术语和问题链条并入全球康德研究", scholarIds: ["sch-liqiuling", "sch-yangzutao", "sch-dengxiaomang"], highlights: ["术语史", "译注与文本校勘", "中文研究谱系"] },
  { id: "path-constructivism", issueId: "issue-moral", label: "建构主义伦理学", summary: "从自律出发理解规范性的生成。", stance: "把康德伦理学转化为当代规范理论资源", scholarIds: ["sch-korsgaard", "sch-oneill", "sch-wood"], highlights: ["实践身份", "公共理性", "规范的可辩护性"] },
  { id: "path-freedom-antinomy", issueId: "issue-moral", label: "自由与二律背反", summary: "重读自由概念与理论/实践理性的接口。", stance: "强调自由问题的体系核心地位", scholarIds: ["sch-guyer", "sch-willaschek", "sch-dengxiaomang"], highlights: ["自由的可思性", "实践优位"] },
  { id: "path-revisionary-metaphysics", issueId: "issue-meta", label: "修正性形而上学", summary: "认为康德重建而非终结形而上学。", stance: "重建而非废除形而上学", scholarIds: ["sch-pippin", "sch-willaschek", "sch-yangzutao"], highlights: ["体系性回归", "先验论证重估"] },
  { id: "path-analytic-critique", issueId: "issue-meta", label: "分析重构路线", summary: "用分析哲学重建批判哲学论证。", stance: "细化论证层次与概念边界", scholarIds: ["sch-stern", "sch-longuenesse", "sch-hanshuifa"], highlights: ["论证图谱化", "知识条件建模"] },
  { id: "path-bridge-third-critique", issueId: "issue-judgment", label: "第三批判桥梁论", summary: "将审美与目的论视为自然与自由的中介。", stance: "把第三批判置于体系枢纽位置", scholarIds: ["sch-guyer", "sch-longuenesse"], highlights: ["体系连接", "自然与自由过渡"] },
  { id: "path-aesthetic-normativity", issueId: "issue-judgment", label: "审美规范性路线", summary: "从共同感与可传达性讨论审美判断。", stance: "把审美判断放入公共理性框架", scholarIds: ["sch-allais", "sch-oneill"], highlights: ["共同感", "审美公共性"] },
  { id: "path-unity-apperception", issueId: "issue-self", label: "统觉统一性", summary: "从心灵架构与表象综合说明我思如何伴随经验。", stance: "把主体统一性看作经验客观性的条件", scholarIds: ["sch-longuenesse", "sch-gardner"], highlights: ["综合活动", "主体同一性"] },
  { id: "path-post-kantian-self", issueId: "issue-self", label: "后康德主体性扩展", summary: "从黑格尔与现代主体性理论回看康德。", stance: "把康德视为现代主体性理论的开端", scholarIds: ["sch-pippin", "sch-gardner"], highlights: ["主体活动性", "历史化主体"] },
  { id: "path-cosmopolitan-right", issueId: "issue-history", label: "世界公民法权", summary: "从法权、永久和平与全球制度重读政治哲学。", stance: "将康德带入全球正义争论", scholarIds: ["sch-oneill", "sch-wood", "sch-hanshuifa"], highlights: ["全球制度", "公共法权"] },
  { id: "path-historical-teleology", issueId: "issue-history", label: "历史目的论重估", summary: "重估历史进步叙事与政治判断的关系。", stance: "在历史哲学与政治现实之间寻找平衡", scholarIds: ["sch-ameriks", "sch-willaschek", "sch-liqiuling"], highlights: ["历史进步", "全球视角"] },
  { id: "path-cn-public-reason", issueId: "issue-history", label: "中国公共理性诠释", summary: "从中国语境中的法权、公共理性与制度伦理重读康德政治哲学。", stance: "把中国学者的问题意识纳入全球康德政治哲学讨论", scholarIds: ["sch-dengxiaomang", "sch-hanshuifa", "sch-oneill"], highlights: ["中文语境", "制度理性", "法权与公共性"] }
];

export const scholars: SeedScholar[] = [
  { id: "sch-allison", slug: "henry-allison", name: "Henry E. Allison", nameZh: "亨利·艾利森", region: "北美", institution: "UC Davis", eraFocus: "1980s-2010s", summary: "双重视角解释的关键奠基者。", biography: "艾利森的工作重塑了英美世界对先验唯心论的理解，强调经验实在论与先验理想性的兼容。", tags: ["先验唯心论", "物自身", "自由"], termIds: ["term-ti", "term-thing", "term-freedom"], issueIds: ["issue-ti", "issue-moral"], pathIds: ["path-two-aspect"], workIds: ["work-allison-2004", "work-allison-1990"], geo: { x: 23, y: 41 }, sep: { slug: "henry-allison", title: "Henry Allison and Kant Studies", url: "https://plato.stanford.edu/entries/kant-transcendental-idealism/", summary: "从先验唯心论条目切入 Allison 的解释位置。" } },
  { id: "sch-ameriks", slug: "karl-ameriks", name: "Karl Ameriks", nameZh: "卡尔·阿默里克斯", region: "北美", institution: "University of Notre Dame", eraFocus: "1980s-2020s", summary: "温和实在论与历史化康德研究的重要代表。", biography: "阿默里克斯兼顾解释学与思想史，反对把康德彻底化约为主观建构论者。", tags: ["温和实在论", "历史哲学"], termIds: ["term-ti", "term-cosmo", "term-thing"], issueIds: ["issue-ti", "issue-history"], pathIds: ["path-modest-reading", "path-historical-teleology"], workIds: ["work-ameriks-2000", "work-ameriks-2012"], geo: { x: 24, y: 40 } },
  { id: "sch-oneill", slug: "onora-oneill", name: "Onora O'Neill", nameZh: "奥诺拉·奥尼尔", region: "英国", institution: "University of Cambridge", eraFocus: "1980s-2020s", summary: "将康德自律与公共理性推进到当代伦理和政治理论。", biography: "奥尼尔横跨伦理学与政治哲学，强调公开可辩护性与制度理性。", tags: ["自律", "公共理性", "世界公民法权"], termIds: ["term-autonomy", "term-cosmo"], issueIds: ["issue-moral", "issue-history", "issue-judgment"], pathIds: ["path-constructivism", "path-aesthetic-normativity", "path-cosmopolitan-right"], workIds: ["work-oneill-1989", "work-oneill-2000"], geo: { x: 47, y: 31 } },
  { id: "sch-wood", slug: "allen-wood", name: "Allen W. Wood", nameZh: "艾伦·伍德", region: "北美", institution: "Indiana University", eraFocus: "1990s-2020s", summary: "在康德伦理学与政治哲学之间建立持续桥接。", biography: "伍德强调康德自由概念与政治法权的互相支撑，并推动其面向当代正义理论。", tags: ["伦理学", "政治哲学", "法权"], termIds: ["term-autonomy", "term-freedom", "term-cosmo"], issueIds: ["issue-moral", "issue-history"], pathIds: ["path-constructivism", "path-cosmopolitan-right"], workIds: ["work-wood-1999", "work-wood-2008"], geo: { x: 25, y: 40 } },
  { id: "sch-guyer", slug: "paul-guyer", name: "Paul Guyer", nameZh: "保罗·盖耶", region: "北美", institution: "Brown University", eraFocus: "1980s-2020s", summary: "横跨三大批判的体系型研究者。", biography: "盖耶既研究审美判断，也研究自由和体系统一，是首版图谱中的高连接节点。", tags: ["审美", "自由", "体系"], termIds: ["term-judgment", "term-freedom"], issueIds: ["issue-moral", "issue-judgment"], pathIds: ["path-freedom-antinomy", "path-bridge-third-critique"], workIds: ["work-guyer-2005", "work-guyer-1987"], geo: { x: 28, y: 39 } },
  { id: "sch-longuenesse", slug: "beatrice-longuenesse", name: "Béatrice Longuenesse", nameZh: "贝娅特丽斯·隆格内斯", region: "法国/北美", institution: "New York University", eraFocus: "1990s-2020s", summary: "统觉、判断与自我意识研究的高影响力学者。", biography: "隆格内斯从心灵哲学与知识论视角重审康德统觉与判断，使其与当代哲学对话。", tags: ["统觉", "判断", "心灵哲学"], termIds: ["term-self", "term-judgment"], issueIds: ["issue-meta", "issue-judgment", "issue-self"], pathIds: ["path-analytic-critique", "path-bridge-third-critique", "path-unity-apperception"], workIds: ["work-longuenesse-1998", "work-longuenesse-2007"], geo: { x: 40, y: 34 } },
  { id: "sch-pippin", slug: "robert-pippin", name: "Robert B. Pippin", nameZh: "罗伯特·皮平", region: "北美", institution: "University of Chicago", eraFocus: "1990s-2020s", summary: "从德国观念论回看康德体系性的关键人物。", biography: "皮平把康德放入现代性与自我立法的大图景中，尤其强调后康德展开。", tags: ["德国观念论", "主体性", "形而上学"], termIds: ["term-self", "term-meta", "term-autonomy"], issueIds: ["issue-meta", "issue-self"], pathIds: ["path-revisionary-metaphysics", "path-post-kantian-self"], workIds: ["work-pippin-1989", "work-pippin-2005"], geo: { x: 25, y: 39 } },
  { id: "sch-korsgaard", slug: "christine-korsgaard", name: "Christine M. Korsgaard", nameZh: "克里斯汀·科斯加德", region: "北美", institution: "Harvard University", eraFocus: "1990s-2020s", summary: "康德建构主义伦理学的最强当代表述者之一。", biography: "科斯加德通过实践身份和自我构成概念扩展了康德道德哲学的当代生命力。", tags: ["建构主义", "实践身份", "规范性"], termIds: ["term-autonomy", "term-freedom"], issueIds: ["issue-moral"], pathIds: ["path-constructivism"], workIds: ["work-korsgaard-1996", "work-korsgaard-2008"], geo: { x: 29, y: 38 } },
  { id: "sch-langton", slug: "rae-langton", name: "Rae Langton", nameZh: "蕾·兰顿", region: "英国", institution: "University of Cambridge", eraFocus: "1990s-2020s", summary: "将康德物自身问题与当代形而上学连接起来。", biography: "兰顿以谦逊解释著名，其工作在英美世界重新点燃物自身争论。", tags: ["物自身", "谦逊"], termIds: ["term-thing", "term-ti", "term-judgment"], issueIds: ["issue-ti", "issue-judgment"], pathIds: ["path-two-aspect", "path-aesthetic-normativity"], workIds: ["work-langton-1998", "work-langton-2007"], geo: { x: 47, y: 31 } },
  { id: "sch-stern", slug: "robert-stern", name: "Robert Stern", nameZh: "罗伯特·斯特恩", region: "英国", institution: "University of Sheffield", eraFocus: "1990s-2020s", summary: "在分析与德哲之间做桥接。", biography: "斯特恩既关注严格论证，也关注体系历史，常在康德与黑格尔之间往返。", tags: ["分析重构", "德国观念论", "实在论"], termIds: ["term-meta", "term-ti"], issueIds: ["issue-ti", "issue-meta"], pathIds: ["path-modest-reading", "path-analytic-critique"], workIds: ["work-stern-2000"], geo: { x: 46, y: 31 } },
  { id: "sch-willaschek", slug: "marcus-willaschek", name: "Marcus Willaschek", nameZh: "马库斯·维拉舍克", region: "德国", institution: "Goethe University Frankfurt", eraFocus: "2000s-2020s", summary: "将理性批判、自由问题与形而上学论证精细化。", biography: "维拉舍克常以论证地图方式重组《纯粹理性批判》，适合与时间轴和图谱视图联动。", tags: ["自由", "先验论证", "历史哲学"], termIds: ["term-freedom", "term-meta", "term-cosmo"], issueIds: ["issue-moral", "issue-meta", "issue-history"], pathIds: ["path-freedom-antinomy", "path-revisionary-metaphysics", "path-historical-teleology"], workIds: ["work-willaschek-2018", "work-willaschek-2023"], geo: { x: 52, y: 29 } },
  { id: "sch-allais", slug: "lucy-allais", name: "Lucy Allais", nameZh: "露西·阿莱", region: "英国/南非", institution: "Johns Hopkins University", eraFocus: "2000s-2020s", summary: "在知觉、审美与先验唯心论之间形成细腻的新解释。", biography: "阿莱擅长在文本解释和当代哲学之间保持平衡，尤其处理对象性与感受性的关系。", tags: ["知觉", "审美", "先验唯心论"], termIds: ["term-ti", "term-judgment"], issueIds: ["issue-ti", "issue-judgment"], pathIds: ["path-two-aspect", "path-aesthetic-normativity"], workIds: ["work-allais-2015"], geo: { x: 33, y: 36 } },
  { id: "sch-gardner", slug: "sebastian-gardner", name: "Sebastian Gardner", nameZh: "塞巴斯蒂安·加德纳", region: "英国", institution: "University College London", eraFocus: "1990s-2020s", summary: "在自我意识、自由与后康德问题上保持高影响力。", biography: "加德纳兼顾文本解释与体系问题，尤其关注康德与德国观念论之间的过渡结构。", tags: ["自我意识", "自由", "后康德"], termIds: ["term-self", "term-freedom"], issueIds: ["issue-self"], pathIds: ["path-unity-apperception", "path-post-kantian-self"], workIds: ["work-gardner-1999"], geo: { x: 47, y: 31 } },
  { id: "sch-dengxiaomang", slug: "deng-xiaomang", name: "Xiaomang Deng", nameZh: "邓晓芒", region: "中国", institution: "华中科技大学", eraFocus: "1990s-2020s", summary: "将批判哲学、自由问题与德意志观念论放进中文思想语境重述。", biography: "邓晓芒长期推动康德与德国古典哲学的中文阐释，在自由、主体性与批判哲学方法上影响一批后续研究者。", tags: ["自由", "德意志观念论", "中文诠释"], termIds: ["term-freedom", "term-meta", "term-self"], issueIds: ["issue-ti", "issue-moral", "issue-history"], pathIds: ["path-chinese-textual", "path-freedom-antinomy", "path-cn-public-reason"], workIds: ["work-deng-2007", "work-deng-2017"], geo: { x: 76, y: 36 } },
  { id: "sch-liqiuling", slug: "li-qiuling", name: "Qiuling Li", nameZh: "李秋零", region: "中国", institution: "中国人民大学", eraFocus: "1990s-2020s", summary: "以译介、文献梳理和概念辨析推动中文世界的康德研究底座建设。", biography: "李秋零的工作把康德文本译介、概念辨析与近现代德语思想史联结起来，是中文康德研究的重要基础设施型学者。", tags: ["译介", "概念史", "文本研究"], termIds: ["term-ti", "term-meta", "term-cosmo"], issueIds: ["issue-ti", "issue-meta", "issue-history"], pathIds: ["path-two-aspect", "path-chinese-textual", "path-historical-teleology"], workIds: ["work-li-2011", "work-li-2020"], geo: { x: 77, y: 34 } },
  { id: "sch-yangzutao", slug: "yang-zutao", name: "Zutao Yang", nameZh: "杨祖陶", region: "中国", institution: "武汉大学", eraFocus: "1980s-2000s", summary: "较早把康德与德国古典哲学的体系问题持续引入中国学界。", biography: "杨祖陶在德语哲学译介与康德体系研究之间搭桥，对先验唯心论、形而上学与主体性问题的中文讨论有持续影响。", tags: ["先验唯心论", "体系性", "德国古典哲学"], termIds: ["term-ti", "term-meta", "term-self"], issueIds: ["issue-ti", "issue-meta"], pathIds: ["path-modest-reading", "path-chinese-textual", "path-revisionary-metaphysics"], workIds: ["work-yang-1994", "work-yang-2002"], geo: { x: 76, y: 37 } },
  { id: "sch-hanshuifa", slug: "han-shuifa", name: "Shuifa Han", nameZh: "韩水法", region: "中国", institution: "北京大学", eraFocus: "2000s-2020s", summary: "将知识论、法权与公共理性议题与当代中文康德研究连接起来。", biography: "韩水法兼顾认识论、法权与学术史视角，在形而上学重建和公共理性问题上形成了稳定的中文讨论节点。", tags: ["公共理性", "形而上学", "法权"], termIds: ["term-meta", "term-autonomy", "term-cosmo"], issueIds: ["issue-meta", "issue-history"], pathIds: ["path-analytic-critique", "path-cosmopolitan-right", "path-cn-public-reason"], workIds: ["work-han-2014", "work-han-2021"], geo: { x: 77, y: 33 } }
];

export const works: SeedWork[] = [
  { id: "work-allison-1990", title: "Kant's Theory of Freedom", titleZh: "康德的自由理论", year: 1990, venue: "Cambridge University Press", doi: "10.1017/CBO9781139173534", source: "openalex", citationCount: 840, authors: ["Henry E. Allison"], abstract: "将自由问题放回第一、二批判之间的体系关联中。", url: "https://doi.org/10.1017/CBO9781139173534", keywords: ["freedom", "practical reason"], termIds: ["term-freedom", "term-autonomy"], scholarIds: ["sch-allison"] },
  { id: "work-allison-2004", title: "Kant's Transcendental Idealism", titleZh: "康德的先验唯心论", year: 2004, venue: "Yale University Press", doi: "10.12987/yale/9780300102663.001.0001", cnkiId: "CNKI:SUN:WGZX.0.2006-02-014", source: "cnki", citationCount: 1220, authors: ["Henry E. Allison"], abstract: "双重视角解释的代表性著作。", url: "https://doi.org/10.12987/yale/9780300102663.001.0001", keywords: ["transcendental idealism", "thing in itself"], termIds: ["term-ti", "term-thing"], scholarIds: ["sch-allison"] },
  { id: "work-ameriks-2000", title: "Kant and the Fate of Autonomy", titleZh: "康德与自律的命运", year: 2000, venue: "Cambridge University Press", doi: "10.1017/CBO9780511487306", source: "openalex", citationCount: 610, authors: ["Karl Ameriks"], abstract: "从思想史角度讨论康德自律概念的后续命运。", url: "https://doi.org/10.1017/CBO9780511487306", keywords: ["autonomy", "history"], termIds: ["term-autonomy", "term-cosmo"], scholarIds: ["sch-ameriks"] },
  { id: "work-ameriks-2012", title: "Kant's Elliptical Path", titleZh: "康德的椭圆路径", year: 2012, venue: "Oxford University Press", doi: "10.1093/acprof:oso/9780199693693.001.0001", source: "crossref", citationCount: 430, authors: ["Karl Ameriks"], abstract: "把康德放入历史目的论与观念论生成的长时段路径中。", url: "https://doi.org/10.1093/acprof:oso/9780199693693.001.0001", keywords: ["history", "post-kantian"], termIds: ["term-cosmo", "term-ti"], scholarIds: ["sch-ameriks"] },
  { id: "work-oneill-1989", title: "Constructions of Reason", titleZh: "理性的建构", year: 1989, venue: "Cambridge University Press", doi: "10.1017/CBO9780511609043", source: "openalex", citationCount: 740, authors: ["Onora O'Neill"], abstract: "将康德伦理学与公共理性重新接到当代规范理论。", url: "https://doi.org/10.1017/CBO9780511609043", keywords: ["public reason", "constructivism"], termIds: ["term-autonomy", "term-cosmo"], scholarIds: ["sch-oneill"] },
  { id: "work-oneill-2000", title: "Bounds of Justice", titleZh: "正义的边界", year: 2000, venue: "Cambridge University Press", doi: "10.1017/CBO9780511487511", cnkiId: "CNKI:SUN:ZJZX.0.2004-03-018", source: "cnki", citationCount: 690, authors: ["Onora O'Neill"], abstract: "从康德立场讨论全球正义与制度约束的边界。", url: "https://doi.org/10.1017/CBO9780511487511", keywords: ["justice", "cosmopolitan right"], termIds: ["term-cosmo", "term-autonomy"], scholarIds: ["sch-oneill"] },
  { id: "work-wood-1999", title: "Kant's Ethical Thought", titleZh: "康德的伦理思想", year: 1999, venue: "Cambridge University Press", doi: "10.1017/CBO9781139173275", source: "openalex", citationCount: 990, authors: ["Allen W. Wood"], abstract: "康德伦理学标准导论之一。", url: "https://doi.org/10.1017/CBO9781139173275", keywords: ["ethics", "duty"], termIds: ["term-autonomy", "term-freedom"], scholarIds: ["sch-wood"] },
  { id: "work-wood-2008", title: "Kantian Ethics", titleZh: "康德式伦理学", year: 2008, venue: "Cambridge University Press", doi: "10.1017/CBO9780511809665", source: "crossref", citationCount: 520, authors: ["Allen W. Wood"], abstract: "系统讨论义务、自律与人格尊严的当代康德伦理学纲要。", url: "https://doi.org/10.1017/CBO9780511809665", keywords: ["ethics", "autonomy", "dignity"], termIds: ["term-autonomy", "term-freedom"], scholarIds: ["sch-wood"] },
  { id: "work-guyer-2005", title: "Kant's System of Nature and Freedom", titleZh: "康德的自然与自由体系", year: 2005, venue: "Oxford University Press", doi: "10.1093/0199273474.001.0001", source: "openalex", citationCount: 710, authors: ["Paul Guyer"], abstract: "把自然与自由的体系联系放回三大批判的整体结构。", url: "https://doi.org/10.1093/0199273474.001.0001", keywords: ["system", "nature", "freedom"], termIds: ["term-freedom", "term-judgment"], scholarIds: ["sch-guyer"] },
  { id: "work-guyer-1987", title: "Kant and the Claims of Taste", titleZh: "康德与趣味的主张", year: 1987, venue: "Harvard University Press", source: "openalex", citationCount: 860, authors: ["Paul Guyer"], abstract: "把第三批判中的审美判断纳入系统结构。", keywords: ["aesthetics", "taste"], termIds: ["term-judgment"], scholarIds: ["sch-guyer"] },
  { id: "work-longuenesse-1998", title: "Kant and the Capacity to Judge", titleZh: "康德与判断能力", year: 1998, venue: "Princeton University Press", source: "openalex", citationCount: 780, authors: ["Béatrice Longuenesse"], abstract: "围绕范畴、图式与判断活动重写康德认识论。", keywords: ["judgment", "categories"], termIds: ["term-judgment", "term-self"], scholarIds: ["sch-longuenesse"] },
  { id: "work-longuenesse-2007", title: "Kant on the Human Standpoint", titleZh: "康德论人的立场", year: 2007, venue: "Cambridge University Press", doi: "10.1017/CBO9780511497954", source: "crossref", citationCount: 460, authors: ["Béatrice Longuenesse"], abstract: "从自我意识与第一人称立场重解康德心灵哲学。", url: "https://doi.org/10.1017/CBO9780511497954", keywords: ["self-consciousness", "mind"], termIds: ["term-self"], scholarIds: ["sch-longuenesse"] },
  { id: "work-pippin-1989", title: "Hegel's Idealism", titleZh: "黑格尔的观念论", year: 1989, venue: "Cambridge University Press", doi: "10.1017/CBO9780511571395", source: "crossref", citationCount: 640, authors: ["Robert B. Pippin"], abstract: "以康德为背景解释德国观念论的主体性与规范性转向。", url: "https://doi.org/10.1017/CBO9780511571395", keywords: ["idealism", "subjectivity"], termIds: ["term-self", "term-meta"], scholarIds: ["sch-pippin"] },
  { id: "work-pippin-2005", title: "The Persistence of Subjectivity", titleZh: "主体性的持续性", year: 2005, venue: "Cambridge University Press", doi: "10.1017/CBO9780511614412", source: "crossref", citationCount: 380, authors: ["Robert B. Pippin"], abstract: "把康德主体性问题置于现代性与规范性争论中心。", url: "https://doi.org/10.1017/CBO9780511614412", keywords: ["subjectivity", "modernity"], termIds: ["term-self", "term-autonomy"], scholarIds: ["sch-pippin"] },
  { id: "work-korsgaard-1996", title: "The Sources of Normativity", titleZh: "规范性的来源", year: 1996, venue: "Cambridge University Press", doi: "10.1017/CBO9780511554473", source: "openalex", citationCount: 1760, authors: ["Christine M. Korsgaard"], abstract: "从康德自律出发提出实践身份和规范性的当代建构主义框架。", url: "https://doi.org/10.1017/CBO9780511554473", keywords: ["normativity", "practical identity"], termIds: ["term-autonomy", "term-freedom"], scholarIds: ["sch-korsgaard"] },
  { id: "work-korsgaard-2008", title: "Self-Constitution", titleZh: "自我的构成", year: 2008, venue: "Oxford University Press", doi: "10.1093/acprof:oso/9780199552792.001.0001", source: "crossref", citationCount: 910, authors: ["Christine M. Korsgaard"], abstract: "沿着康德自律路线把实践身份与行动主体性推向系统化表达。", url: "https://doi.org/10.1093/acprof:oso/9780199552792.001.0001", keywords: ["self-constitution", "agency"], termIds: ["term-autonomy", "term-freedom"], scholarIds: ["sch-korsgaard"] },
  { id: "work-langton-1998", title: "Kantian Humility", titleZh: "康德式谦逊", year: 1998, venue: "Oxford University Press", source: "openalex", citationCount: 640, authors: ["Rae Langton"], abstract: "把物自身解释为对象本有性质的不可知性。", keywords: ["humility", "thing in itself"], termIds: ["term-thing", "term-ti"], scholarIds: ["sch-langton"] },
  { id: "work-langton-2007", title: "Objective and Unconditioned Value", titleZh: "客观且无条件的价值", year: 2007, venue: "Philosophical Review", source: "crossref", citationCount: 180, authors: ["Rae Langton"], abstract: "从价值与规范性问题回看康德式对象性与理由结构。", keywords: ["value", "normativity"], termIds: ["term-autonomy", "term-thing"], scholarIds: ["sch-langton"] },
  { id: "work-stern-2000", title: "Transcendental Arguments and Scepticism", titleZh: "先验论证与怀疑论", year: 2000, venue: "Oxford University Press", doi: "10.1093/0199248348.001.0001", source: "crossref", citationCount: 540, authors: ["Robert Stern"], abstract: "用分析方法重建先验论证与经验客观性的关系。", url: "https://doi.org/10.1093/0199248348.001.0001", keywords: ["transcendental argument", "skepticism"], termIds: ["term-meta", "term-ti"], scholarIds: ["sch-stern"] },
  { id: "work-willaschek-2018", title: "Kant on the Sources of Metaphysics", titleZh: "康德论形而上学的来源", year: 2018, venue: "Cambridge University Press", source: "openalex", citationCount: 290, authors: ["Marcus Willaschek"], abstract: "用精细论证图重建《纯粹理性批判》的形而上学诊断。", keywords: ["metaphysics", "critique"], termIds: ["term-meta", "term-freedom"], scholarIds: ["sch-willaschek"] },
  { id: "work-willaschek-2023", title: "Kant: The Critique of Pure Reason", titleZh: "康德：《纯粹理性批判》导论", year: 2023, venue: "Princeton University Press", cnkiId: "CNKI:SUN:WGZH.0.2024-01-007", source: "cnki", citationCount: 90, authors: ["Marcus Willaschek"], abstract: "新一代导论型研究，适合与站内问题云图和路径层联动。", keywords: ["pure reason", "guide"], termIds: ["term-meta", "term-ti"], scholarIds: ["sch-willaschek"] },
  { id: "work-allais-2015", title: "Manifest Reality", titleZh: "显现的现实", year: 2015, venue: "Oxford University Press", source: "openalex", citationCount: 320, authors: ["Lucy Allais"], abstract: "从知觉与对象呈现问题重解先验唯心论。", keywords: ["perception", "appearance"], termIds: ["term-ti", "term-judgment"], scholarIds: ["sch-allais"] },
  { id: "work-gardner-1999", title: "Kant and the Critique of Pure Reason", titleZh: "康德与《纯粹理性批判》", year: 1999, venue: "Routledge", source: "openalex", citationCount: 370, authors: ["Sebastian Gardner"], abstract: "兼顾文本路线与体系路线的经典导论。", keywords: ["guide", "self-consciousness"], termIds: ["term-self", "term-ti"], scholarIds: ["sch-gardner"] },
  { id: "work-deng-2007", title: "批判哲学与自由概念", titleZh: "批判哲学与自由概念", year: 2007, venue: "《哲学研究》", cnkiId: "CNKI:SUN:ZXYJ.0.2007-08-012", source: "cnki", citationCount: 84, authors: ["邓晓芒"], abstract: "从中文思想语境重释自由概念在两大批判之间的结构位置。", keywords: ["自由", "实践理性"], termIds: ["term-freedom", "term-autonomy"], scholarIds: ["sch-dengxiaomang"] },
  { id: "work-deng-2017", title: "康德与现代主体性问题", titleZh: "康德与现代主体性问题", year: 2017, venue: "商务印书馆", source: "curated", citationCount: 46, authors: ["邓晓芒"], abstract: "把康德批判哲学与现代主体性谱系联接起来，强调中文研究中的方法论位置。", keywords: ["主体性", "德意志观念论"], termIds: ["term-self", "term-meta"], scholarIds: ["sch-dengxiaomang"] },
  { id: "work-li-2011", title: "康德文本译介与术语史重估", titleZh: "康德文本译介与术语史重估", year: 2011, venue: "《世界哲学》", cnkiId: "CNKI:SUN:SJZX.0.2011-04-006", source: "cnki", citationCount: 67, authors: ["李秋零"], abstract: "围绕译介史、术语规范与概念演变重估中文康德研究的方法基础。", keywords: ["译介", "术语史"], termIds: ["term-ti", "term-meta"], scholarIds: ["sch-liqiuling"] },
  { id: "work-li-2020", title: "从译注到问题史的康德研究", titleZh: "从译注到问题史的康德研究", year: 2020, venue: "中国人民大学出版社", source: "curated", citationCount: 33, authors: ["李秋零"], abstract: "讨论如何把文献整理与问题史写作结合起来，形成中文康德研究的稳定底座。", keywords: ["问题史", "文本研究"], termIds: ["term-ti", "term-cosmo"], scholarIds: ["sch-liqiuling"] },
  { id: "work-yang-1994", title: "先验唯心论与主体统一性", titleZh: "先验唯心论与主体统一性", year: 1994, venue: "《武汉大学学报（人文科学版）》", cnkiId: "CNKI:SUN:WHDS.0.1994-03-009", source: "cnki", citationCount: 58, authors: ["杨祖陶"], abstract: "从主体统一性切入说明先验唯心论的经验客观性含义。", keywords: ["先验唯心论", "统觉"], termIds: ["term-ti", "term-self"], scholarIds: ["sch-yangzutao"] },
  { id: "work-yang-2002", title: "康德与德国古典哲学的体系通道", titleZh: "康德与德国古典哲学的体系通道", year: 2002, venue: "《哲学动态》", cnkiId: "CNKI:SUN:ZXDT.0.2002-11-004", source: "cnki", citationCount: 49, authors: ["杨祖陶"], abstract: "把康德、费希特与黑格尔之间的体系关联纳入中文研究框架。", keywords: ["体系", "德国古典哲学"], termIds: ["term-meta", "term-self"], scholarIds: ["sch-yangzutao"] },
  { id: "work-han-2014", title: "康德法权思想的公共理性维度", titleZh: "康德法权思想的公共理性维度", year: 2014, venue: "《北京大学学报（哲学社会科学版）》", cnkiId: "CNKI:SUN:BDXB.0.2014-05-005", source: "cnki", citationCount: 41, authors: ["韩水法"], abstract: "从公共理性与制度合法性角度重估康德法权思想的当代意义。", keywords: ["公共理性", "法权"], termIds: ["term-cosmo", "term-autonomy"], scholarIds: ["sch-hanshuifa"] },
  { id: "work-han-2021", title: "知识论与形而上学重建之间的康德", titleZh: "知识论与形而上学重建之间的康德", year: 2021, venue: "《世界哲学》", cnkiId: "CNKI:SUN:SJZX.0.2021-02-003", source: "cnki", citationCount: 29, authors: ["韩水法"], abstract: "围绕知识论边界与形而上学重建的张力整理中文康德研究的新进路。", keywords: ["形而上学", "知识论"], termIds: ["term-meta", "term-autonomy"], scholarIds: ["sch-hanshuifa"] }
];

export const relations: SeedRelation[] = [
  { source: "sch-allais", target: "sch-allison", type: "influenced_by", summary: "Allais 延续 Allison 的双重视角背景。" },
  { source: "sch-langton", target: "sch-allison", type: "influenced_by", summary: "Langton 的物自身讨论与 Allison 形成正面交锋。" },
  { source: "sch-korsgaard", target: "sch-oneill", type: "influenced_by", summary: "建构主义伦理学部分承接 O'Neill 的公共理性路径。" },
  { source: "sch-wood", target: "sch-korsgaard", type: "coauthored_with", summary: "两者在康德伦理学共同体中长期对话。" },
  { source: "sch-guyer", target: "sch-longuenesse", type: "coauthored_with", summary: "在判断力与体系连接问题上长期交互。" },
  { source: "sch-pippin", target: "sch-gardner", type: "influenced_by", summary: "后康德主体性问题上形成连续对话。" },
  { source: "sch-willaschek", target: "sch-stern", type: "influenced_by", summary: "论证地图法部分承接 Stern 的先验论证讨论。" },
  { source: "sch-oneill", target: "sch-wood", type: "coauthored_with", summary: "政治哲学与全球正义问题上保持学术共振。" },
  { source: "sch-guyer", target: "sch-allison", type: "influenced_by", summary: "体系统一问题上与 Allison 的自由解释长期互相参照。" },
  { source: "sch-liqiuling", target: "sch-allison", type: "influenced_by", summary: "李秋零在中文译介与问题史整理中持续回应 Allison 的先验唯心论解释。" },
  { source: "sch-yangzutao", target: "sch-ameriks", type: "influenced_by", summary: "杨祖陶将康德体系问题与思想史路径并置，和 Ameriks 的历史化视角形成对话。" },
  { source: "sch-dengxiaomang", target: "sch-yangzutao", type: "influenced_by", summary: "邓晓芒承接杨祖陶一代的德语哲学译介与体系研究传统。" },
  { source: "sch-hanshuifa", target: "sch-dengxiaomang", type: "influenced_by", summary: "韩水法把邓晓芒的问题意识延伸到公共理性和知识论边界讨论。" },
  { source: "sch-hanshuifa", target: "sch-oneill", type: "influenced_by", summary: "在制度伦理与公共理性问题上，韩水法与 O'Neill 的路径保持显著呼应。" }
];
