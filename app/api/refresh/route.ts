import { refreshScope } from "@/lib/data/explorer";
import { fail, ok } from "@/lib/server/api";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.scope || !body?.id) {
    return fail("Missing scope or id", 400);
  }
  try {
    return ok(await refreshScope(body.scope, body.id));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Refresh failed", 500);
  }
}
