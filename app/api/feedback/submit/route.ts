import { signedIn, HttpError } from "@/lib/guard";
import { store } from "@/lib/store";
import { ok, fail } from "@/lib/api";
import type { Question } from "@/lib/privacy";

// The response row carries NO user id. A separate receipt row stops double submission.
export async function POST(req: Request) {
  try {
    const p = await signedIn();
    const { campaign_id, answers } = await req.json();
    const db = store();
    const c = await db.get<{ id: string; form_id: string; status: string; unit: string | null; flight: string | null }>("feedback_campaigns", { id: campaign_id });
    if (!c || c.status !== "open") throw new HttpError(404, "This feedback is closed.");
    if ((c.unit && c.unit !== p.unit) || (c.flight && c.flight !== p.flight)) throw new HttpError(403, "Not sent to your flight.");
    if (await db.get("campaign_receipts", { campaign_id, user_id: p.id })) throw new HttpError(409, "You've already answered this one.");
    const form = await db.get<{ questions: Question[] }>("feedback_forms", { id: c.form_id });
    const clean: Record<string, string | number> = {};
    for (const q of form?.questions ?? []) {
      const v = answers?.[q.id];
      if (v == null || v === "") continue;
      if (q.kind === "scale" && [1, 2, 3, 4, 5].includes(Number(v))) clean[q.id] = Number(v);
      else if (q.kind === "choice" && q.options?.includes(String(v))) clean[q.id] = String(v);
      else if (q.kind === "text") clean[q.id] = String(v).slice(0, 2000);
    }
    await db.insert("campaign_receipts", { campaign_id, user_id: p.id, submitted: true, created_at: new Date().toISOString().slice(0, 10) });
    const day = new Date().toISOString().slice(0, 10);
    await db.insert("feedback_responses", { campaign_id, answers: clean, submitted_on: day, created_at: day }); // date only: no timing link to the receipt
    return ok();
  } catch (e) {
    return fail(e);
  }
}
