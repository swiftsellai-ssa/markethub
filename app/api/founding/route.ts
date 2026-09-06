import { mkdir, appendFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { z } from "zod";

const Body = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const line = `${new Date().toISOString()}\t${parsed.data.email}\n`;
  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "founding.tsv"), line, "utf8");
  } catch {
    // Vercel filesystem may be read-only. Still accept the lead.
    console.log("founding_lead", parsed.data.email);
  }

  return NextResponse.json({ ok: true });
}
