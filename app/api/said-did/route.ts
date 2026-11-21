import { signedIn, HttpError } from "@/lib/guard";
import { canFacilitate } from "@/lib/auth";
import { store } from "@/lib/store";
import { ok, fail, str } from "@/lib/api";
export async function POST(req: Request) {
  try {
    const p = await signedIn();
    if (!canFacilitate(p)) throw new HttpError(403, "Facilitators only.");
    const b = await req.json();
    const said = str(b.said, 1000), did = str(b.did, 1000);
    if (!said || !did) throw new HttpError(400, "Both parts are needed.");
    await store().insert("you_said_we_did", { campaign_id: str(b.campaign_id, 60) || null, said, did, at: new Date().toISOString() });
    return ok();
  } catch (e) {
    return fail(e);
  }
}
