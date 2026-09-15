import type { MetadataProvider, ProviderQuery, ProviderResult } from "@/lib/providers/types";

const baseUrl = process.env.OPENALEX_BASE_URL ?? "https://api.openalex.org";

export const openAlexProvider: MetadataProvider = {
  name: "openalex",
  async query(query: ProviderQuery): Promise<ProviderResult> {
    const search = encodeURIComponent(query.scholarName ?? query.issue ?? query.workTitle ?? "Kant");
    return {
      provider: "openalex",
      works: [],
      health: {
        provider: "openalex",
        status: "fallback",
        latencyMs: 140,
        message: `OpenAlex 可用于后续实时检索，当前保留接口并回退到站内种子数据。 ${baseUrl}/works?search=${search}`
      }
    };
  }
};
