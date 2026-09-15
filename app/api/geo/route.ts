import { getGeo } from "@/lib/data/explorer";
import { fail, ok } from "@/lib/server/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const scope = searchParams.get("scope") as "issue" | "scholar" | null;
  const id = searchParams.get("id");
  if (!scope || !id) {
    return fail("Missing scope or id", 400);
  }
  try {
    return ok(getGeo(scope, id));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Geo data not found");
  }
}
