import type { ProviderHealth, SourceName, WorkCitation } from "@/types/explorer";

export interface ProviderQuery {
  scholarName?: string;
  issue?: string;
  workTitle?: string;
}

export interface ProviderResult {
  provider: SourceName;
  works: WorkCitation[];
  health: ProviderHealth;
}

export interface MetadataProvider {
  name: SourceName;
  query(query: ProviderQuery): Promise<ProviderResult>;
}
