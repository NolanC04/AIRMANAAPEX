import { signedIn, HttpError } from "@/lib/guard";
import { canFacilitate } from "@/lib/auth";
import { store } from "@/lib/store";
import { ok, fail, str } from "@/lib/api";
export async function POST(req: Request) {
  try {
    const p = await signedIn();
    if (!canFacilitate(p)) throw new HttpError(403, "Facilitators only.");
    const b = await req.json();
    const title = str(b.title, 140), location = str(b.location, 200);
    if (!title || !location || !b.starts_at) throw new HttpError(400, "Title, start and location are needed.");
    await store().insert("events", { track_id: str(b.track_id, 40), title, starts_at: new Date(b.starts_at).toISOString(), location, description: str(b.description, 2000) || null, capacity: b.capacity ? Number(b.capacity) : null });
    return ok();
  } catch (e) {
    return fail(e);
  }
}
