import { signedIn } from "@/lib/guard";
import { audit } from "@/lib/auth";
import { env } from "@/lib/env";
import { nextForRater, scoreRead } from "@/lib/validation";
import { ok, fail, str } from "@/lib/api";

export async function GET() {
  try {
    return ok(await nextForRater(await signedIn()));
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const p = await signedIn();
    const b = await req.json();
    await scoreRead(p, str(b.read_id, 64), Number(b.grade), str(b.note, 1000), env.geneRubricVersion);
    await audit(p, "rater.scored", str(b.read_id, 64));
    return ok();
  } catch (e) {
    return fail(e);
  }
}
