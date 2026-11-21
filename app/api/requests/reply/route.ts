import { signedIn, HttpError } from "@/lib/guard";
import { canFacilitate, type Profile } from "@/lib/auth";
import { store } from "@/lib/store";
import { notify, staffEmails } from "@/lib/notify";
import { ok, fail, str } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const p = await signedIn();
    const b = await req.json();
    const db = store();
    const r = await db.get<{ id: string; user_id: string }>("session_requests", { id: b.request_id });
    if (!r || (r.user_id !== p.id && !canFacilitate(p))) throw new HttpError(404, "Request not found.");
    const body = str(b.body, 4000);
    if (!body) throw new HttpError(400, "Write a reply first.");
    await db.insert("request_messages", { request_id: r.id, author_id: p.id, author_role: p.id === r.user_id ? "learner" : "staff", body, at: new Date().toISOString() });
    const requester = await db.get<Profile>("profiles", { id: r.user_id });
    const to = p.id === r.user_id ? await staffEmails() : requester ? [requester.email] : [];
    await notify(to, p.id === r.user_id ? `/facilitator/requests/${r.id}` : `/app/unit/requests/${r.id}`);
    return ok();
  } catch (e) {
    return fail(e);
  }
}
