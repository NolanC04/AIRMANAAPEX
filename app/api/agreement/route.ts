import { signedIn, HttpError } from "@/lib/guard";
import { store } from "@/lib/store";
import { AGREEMENT_VERSION } from "@/lib/agreement";
import { ok, fail, str } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const p = await signedIn();
    const b = await req.json();
    if (b.agree !== true) throw new HttpError(400, "Check the box to agree.");
    const signature = str(b.signature, 120);
    if (signature.split(/\s+/).length < 2) throw new HttpError(400, "Type your full name.");
    await store().upsert("agreements", { user_id: p.id, version: AGREEMENT_VERSION, signature, audio_consent: b.audio === true, group: p.role === "comparison" ? "comparison" : "cohort", signed_at: new Date().toISOString() }, "user_id,version");
    return ok();
  } catch (e) {
    return fail(e);
  }
}
