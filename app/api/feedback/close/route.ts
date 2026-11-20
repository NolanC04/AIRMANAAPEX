import { signedIn, HttpError } from "@/lib/guard";
import { canFacilitate } from "@/lib/auth";
import { store } from "@/lib/store";
import { ok, fail } from "@/lib/api";
export async function POST(req: Request) {
  try {
    const p = await signedIn();
    if (!canFacilitate(p)) throw new HttpError(403, "Facilitators only.");
    await store().update("feedback_campaigns", { id: (await req.json()).id }, { status: "closed", closes_at: new Date().toISOString() });
    return ok();
  } catch (e) {
    return fail(e);
  }
}
