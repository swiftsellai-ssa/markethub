import { POST as foundingLead } from "@/app/api/founding-lead/route";

/** @deprecated Prefer POST /api/founding-lead */
export async function POST(req: Request) {
  return foundingLead(req);
}
