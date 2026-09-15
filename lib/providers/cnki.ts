import type { MetadataProvider, ProviderQuery, ProviderResult } from "@/lib/providers/types";

const cnkiEndpoint = process.env.CNKI_SEARCH_ENDPOINT;
const cnkiCookie = process.env.CNKI_SESSION_COOKIE;

export const cnkiProvider: MetadataProvider = {
  name: "cnki",
  async query(query: ProviderQuery): Promise<ProviderResult> {
    const label = query.scholarName ?? query.issue ?? query.workTitle ?? "seed";
    const ready = Boolean(cnkiEndpoint && cnkiCookie);

    return {
      provider: "cnki",
      works: [],
      health: {
        provider: "cnki",
        status: ready ? "fallback" : "offline",
        latencyMs: ready ? 180 : 0,
        message: ready
          ? `CNKI 适配器已配置，但首版仍使用本地策展与缓存数据兜底：${label}`
          : "CNKI 未配置可用会话，当前返回受限实时源占位状态。"
      }
    };
  }
};
