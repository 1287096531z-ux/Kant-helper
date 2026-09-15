import { getGraph } from "@/lib/data/explorer";
import { fail, ok } from "@/lib/server/api";
import type { GraphScope } from "@/types/explorer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") as GraphScope | null;
  const id = searchParams.get("id");
  if (!scope || !id) {
    return fail("Missing scope or id", 400);
  }
  try {
    return ok(getGraph(scope, id));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Graph not found");
  }
}
