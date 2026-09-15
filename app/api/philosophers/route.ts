import { getPhilosophers } from "@/lib/data/explorer";
import { ok } from "@/lib/server/api";

export async function GET() {
  return ok(getPhilosophers());
}
