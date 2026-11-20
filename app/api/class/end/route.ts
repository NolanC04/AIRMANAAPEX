import { signedIn, HttpError } from "@/lib/guard";
import { canFacilitate, audit } from "@/lib/auth";
import { store } from "@/lib/store";
import { ok, fail } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const p = await signedIn();
    if (!canFacilitate(p)) throw new HttpError(403, "Facilitators only.");
    const { id } = await req.json();
    const hit = await store().update("class_sessions", { id, closed_at: null }, { closed_at: new Date().toISOString() });
    if (!hit.length) throw new HttpError(404, "That class is not open.");
    await audit(p, "class.ended", id);
    return ok();
  } catch (e) {
    return fail(e);
  }
}
