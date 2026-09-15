import { getExplorerPayload } from "@/lib/data/explorer";
import { fail, ok } from "@/lib/server/api";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== "kant") {
    return fail("Philosopher not found");
  }
  return ok(getExplorerPayload());
}
