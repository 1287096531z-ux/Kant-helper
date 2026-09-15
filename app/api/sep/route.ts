import { resolveSep } from "@/lib/data/explorer";
import { fail, ok } from "@/lib/server/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get("term");
  if (!term) {
    return fail("Missing term", 400);
  }
  const resolved = resolveSep(term);
  if (!resolved) {
    return fail("SEP entry not found");
  }
  return ok(resolved);
}
