import { signedIn, HttpError } from "@/lib/guard";
import { canFacilitate } from "@/lib/auth";
import { store } from "@/lib/store";
import { ok, fail } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const p = await signedIn();
    if (!canFacilitate(p)) throw new HttpError(403, "Facilitators only.");
    const { id, status } = await req.json();
    if (!["new", "scheduled", "completed", "closed"].includes(status)) throw new HttpError(400, "Unknown status.");
    await store().update("session_requests", { id }, { status, ...(status === "completed" ? { completed_at: new Date().toISOString() } : {}) });
    return ok();
  } catch (e) {
    return fail(e);
  }
}
