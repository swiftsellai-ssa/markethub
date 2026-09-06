import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    hasKey: Boolean(process.env.XAI_API_KEY),
    bot: "x",
  });
}
