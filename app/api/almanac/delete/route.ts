import { signedIn, HttpError } from "@/lib/guard";
import { store } from "@/lib/store";
import { ok, fail } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const p = await signedIn();
    if ((await req.json()).confirm !== "DELETE") throw new HttpError(400, "Type DELETE to confirm.");
    const db = store();
    await Promise.all([db.remove("module_entries", { user_id: p.id }), db.remove("daily_reps", { user_id: p.id }), db.remove("observations", { user_id: p.id })]);
    await db.insert("audit_log", { actor_id: p.id, actor_anon: p.anon_id, action: "almanac.deleted", target: p.id, detail: {}, at: new Date().toISOString() });
    return ok();
  } catch (e) {
    return fail(e);
  }
}
