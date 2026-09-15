import { getRelatedScholars } from "@/lib/data/explorer";
import { fail, ok } from "@/lib/server/api";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    return ok(getRelatedScholars(id));
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Scholar not found");
  }
}
