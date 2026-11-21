import { signedIn, HttpError } from "@/lib/guard";
import { canFacilitate } from "@/lib/auth";
import { store } from "@/lib/store";
import { toCSV, type CheckinRow } from "@/lib/measures";
import { fail } from "@/lib/api";
export async function GET() {
  try {
    const p = await signedIn();
    if (!canFacilitate(p)) throw new HttpError(403, "Facilitators only.");
    const csv = toCSV(await store().list<CheckinRow>("checkins"));
    return new Response(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="aapex-outcomes.csv"' } });
  } catch (e) {
    return fail(e);
  }
}
