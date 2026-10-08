import { NextResponse } from "next/server";
import { isNilDBAvailable } from "@/lib/nildb/status";

export const dynamic = "force-dynamic";

export async function GET() {
  const available = await isNilDBAvailable();
  return NextResponse.json(
    { available },
    { headers: { "Cache-Control": "no-store" } },
  );
}
