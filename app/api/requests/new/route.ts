import { signedIn, HttpError } from "@/lib/guard";
import { store } from "@/lib/store";
import { notify, staffEmails } from "@/lib/notify";
import { ok, fail, str } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const p = await signedIn();
    const b = await req.json();
    if (!["one_on_one", "small_group", "flight"].includes(b.kind)) throw new HttpError(400, "Choose a kind.");
    const preferred_times = str(b.preferred_times, 300);
    if (!preferred_times) throw new HttpError(400, "Times that work is needed.");
    const r = await store().insert<{ id: string }>("session_requests", { user_id: p.id, kind: b.kind, preferred_times, note: str(b.note, 2000) || null, status: "new", completed_at: null });
    const sent = await notify(await staffEmails(), `/facilitator/requests/${r.id}`);
    return ok({ redirect: `/app/unit/requests/${r.id}`, notified: sent });
  } catch (e) {
    return fail(e);
  }
}
