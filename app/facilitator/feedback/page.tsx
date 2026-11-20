import Link from "next/link";
import { store } from "@/lib/store";
import { FeedbackBuilder } from "./Builder";
import { Form } from "@/components/Form";

export default async function FeedbackAdmin() {
  const db = store();
  const campaigns = await db.list<{ id: string; title: string; unit: string | null; flight: string | null; status: string; sent_at: string }>("feedback_campaigns", undefined, { column: "sent_at", ascending: false });
  const counts = await Promise.all(campaigns.map((c) => db.count("feedback_responses", { campaign_id: c.id })));
  return (
    <main className="page-wide" style={{ display: "grid", gap: 18 }}>
      <section className="card"><span className="k">CAMPAIGNS</span>
        <table className="table"><thead><tr><th>Title</th><th>To</th><th>Status</th><th>Responses</th><th></th></tr></thead><tbody>
          {campaigns.map((c, i) => <tr key={c.id}><td>{c.title}</td><td>{c.unit ?? "All"}{c.flight ? ` / ${c.flight}` : ""}</td><td>{c.status}</td><td>{counts[i]}</td><td><Link href={`/facilitator/feedback/${c.id}`}>Report</Link></td></tr>)}
        </tbody></table>
      </section>
      <section className="card"><span className="k">BUILD AND SEND</span><FeedbackBuilder /></section>
      <section className="card"><span className="k">YOU SAID · WE DID</span>
        <Form endpoint="/api/said-did" reload submit="Post" fields={[{ name: "campaign_id", label: "Campaign id (optional)" }, { name: "said", label: "You said", type: "textarea", required: true }, { name: "did", label: "We did", type: "textarea", required: true }]} />
      </section>
    </main>
  );
}
