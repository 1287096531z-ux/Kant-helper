import type { MetadataProvider, ProviderQuery, ProviderResult } from "@/lib/providers/types";

const baseUrl = process.env.CROSSREF_BASE_URL ?? "https://api.crossref.org";

export const crossrefProvider: MetadataProvider = {
  name: "crossref",
  async query(query: ProviderQuery): Promise<ProviderResult> {
    const search = encodeURIComponent(query.scholarName ?? query.issue ?? query.workTitle ?? "Kant");
    return {
      provider: "crossref",
      works: [],
      health: {
        provider: "crossref",
        status: "fallback",
        latencyMs: 150,
        message: `Crossref 作为 DOI 与期刊补全源保留接口，当前回退到站内种子数据。 ${baseUrl}/works?query=${search}`
      }
    };
  }
};
