import { signedIn, HttpError } from "@/lib/guard";
import { isAdmin, audit } from "@/lib/auth";
import { store } from "@/lib/store";
import { ok, fail } from "@/lib/api";
export async function POST(req: Request) {
  try {
    const p = await signedIn();
    if (!isAdmin(p)) throw new HttpError(403, "Admins only.");
    const b = await req.json();
    const patch: Record<string, boolean> = {};
    for (const k of ["modules_readable_after_completion", "daily_reps_between_sessions"]) if (typeof b[k] === "boolean") patch[k] = b[k];
    await store().update("settings", { id: "settings" }, patch);
    await audit(p, "settings.changed", "settings", patch);
    return ok();
  } catch (e) {
    return fail(e);
  }
}
