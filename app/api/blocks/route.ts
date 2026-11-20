import { signedIn, HttpError } from "@/lib/guard";
import { canFacilitate } from "@/lib/auth";
import { store } from "@/lib/store";
import { ok, fail, str } from "@/lib/api";
export async function POST(req: Request) {
  try {
    const p = await signedIn();
    if (!canFacilitate(p)) throw new HttpError(403, "Facilitators only.");
    const b = await req.json();
    if (!/^\d{4}-\d{2}$/.test(str(b.month, 7))) throw new HttpError(400, "Month as YYYY-MM.");
    const row = { unit: str(b.unit, 60), flight: str(b.flight, 60), month: str(b.month, 7), topic: str(b.topic, 200), starts_at: b.starts_at ? new Date(b.starts_at).toISOString() : null, facilitator_id: p.id, source_campaign_id: str(b.source_campaign_id, 60) || null };
    if (!row.unit || !row.flight || !row.topic) throw new HttpError(400, "Unit, flight and topic are needed.");
    await store().insert("flight_blocks", row);
    return ok();
  } catch (e) {
    return fail(e);
  }
}
