import { NextResponse } from "next/server";

export function ok(data: unknown) {
  return NextResponse.json(data);
}

export function fail(message: string, status = 404) {
  return NextResponse.json({ error: message }, { status });
}
