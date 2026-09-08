import { NextResponse } from "next/server";

/** Closed: unauthenticated generate burned xAI credits. Use POST /api/run-desk. */
export async function POST() {
  return NextResponse.json(
    {
      error: "This route is closed. Sign in and POST /api/run-desk with deskType seo.",
      code: "GONE",
    },
    { status: 410 },
  );
}
