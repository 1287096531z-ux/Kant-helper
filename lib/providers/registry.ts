import { cnkiProvider } from "@/lib/providers/cnki";
import { crossrefProvider } from "@/lib/providers/crossref";
import { openAlexProvider } from "@/lib/providers/openalex";

export const providerRegistry = [cnkiProvider, openAlexProvider, crossrefProvider];
