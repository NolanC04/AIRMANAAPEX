import { signedIn, HttpError } from "@/lib/guard";
import { canFacilitate } from "@/lib/auth";
import { store } from "@/lib/store";
import { ok, fail, str } from "@/lib/api";
import type { Question } from "@/lib/privacy";

export async function POST(req: Request) {
  try {
    const p = await signedIn();
    if (!canFacilitate(p)) throw new HttpError(403, "Facilitators only.");
    const b = await req.json();
    const title = str(b.title, 140);
    const questions: Question[] = (Array.isArray(b.questions) ? b.questions : []).map((q: Question, i: number) => ({ id: `q${i + 1}`, kind: q.kind, prompt: str(q.prompt, 300), ...(q.kind === "choice" ? { options: (q.options ?? []).map((o) => str(o, 80)).filter(Boolean).slice(0, 8) } : {}) }));
    if (!title) throw new HttpError(400, "Give the campaign a title.");
    if (!questions.length || questions.some((q) => !q.prompt || !["scale", "choice", "text"].includes(q.kind) || (q.kind === "choice" && (q.options?.length ?? 0) < 2))) throw new HttpError(400, "Every question needs text; multiple choice needs two options.");
    const db = store();
    const form = await db.insert<{ id: string }>("feedback_forms", { title, questions, created_by: p.id });
    await db.insert("feedback_campaigns", { form_id: form.id, title, unit: str(b.unit, 60) || null, flight: str(b.flight, 60) || null, sent_at: new Date().toISOString(), closes_at: null, status: "open" });
    return ok();
  } catch (e) {
    return fail(e);
  }
}
