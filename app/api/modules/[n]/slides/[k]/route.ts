import { moduleAccess, HttpError } from "@/lib/guard";
import { buildSlides } from "@/lib/slides";
import { slideReadable } from "@/lib/access";
import { LEARNER_FIELDS, type ModuleContent } from "@/lib/program";
import { ok, fail } from "@/lib/api";

// Direct-API proof of the class wall and the Bridge gate.
export async function GET(_: Request, { params }: { params: Promise<{ n: string; k: string }> }) {
  try {
    const { n: nr, k: kr } = await params;
    const { m, e, n } = await moduleAccess(nr);
    const k = Number(kr);
    if (!slideReadable(k, Boolean(e.bridge_at))) throw new HttpError(403, "Locked until the Bridge answer is submitted.");
    const learner = Object.fromEntries(LEARNER_FIELDS.filter((f) => m.content[f] != null).map((f) => [f, m.content[f]])) as ModuleContent;
    const slide = buildSlides(n, learner).find((s) => s.n === k);
    if (!slide) throw new HttpError(404, "No such slide.");
    return ok({ slide });
  } catch (e) {
    return fail(e);
  }
}
