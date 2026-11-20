import { notFound } from "next/navigation";
import { store } from "@/lib/store";
import { settings } from "@/lib/data";
import { aggregate, reportVisible, type Question, type Answer } from "@/lib/privacy";
import { ActionButton } from "@/components/Form";

export default async function Report({ params }: { params: Promise<{ id: string }> }) {
  const db = store();
  const c = await db.get<{ id: string; title: string; form_id: string; status: string }>("feedback_campaigns", { id: (await params).id });
  if (!c) notFound();
  const [form, responses, s] = await Promise.all([db.get<{ questions: Question[] }>("feedback_forms", { id: c.form_id }), db.list<{ answers: Record<string, Answer> }>("feedback_responses", { campaign_id: c.id }), settings()]);
  const visible = reportVisible(responses.length, s.report_threshold);
  return (
    <main className="page-wide" style={{ display: "grid", gap: 16 }}>
      <h1 style={{ fontSize: 24, margin: 0 }}>{c.title}</h1>
      <p style={{ margin: 0 }}>{responses.length} responses · {c.status} {c.status === "open" && <ActionButton ghost endpoint="/api/feedback/close" body={{ id: c.id }} label="Close campaign" />}</p>
      {!visible ? (
        <p className="card" role="status">This report stays hidden until at least {s.report_threshold} people respond, so no answer can be traced to one person. {s.report_threshold - responses.length} to go.</p>
      ) : (
        aggregate(form?.questions ?? [], responses).map((a) => (
          <section key={a.q.id} className="card" style={{ display: "grid", gap: 6 }}>
            <b>{a.q.prompt}</b><span className="help">{a.n} answered{a.mean != null ? ` · mean ${a.mean.toFixed(2)}` : ""}</span>
            {"counts" in a && a.counts && Object.entries(a.counts).sort().map(([k, v]) => (
              <div key={k} style={{ display: "grid", gridTemplateColumns: "120px 1fr 40px", gap: 8, alignItems: "center" }}><span>{k}</span><span style={{ height: 10, background: "var(--color-primary)", width: `${(v / a.n) * 100}%`, borderRadius: 5 }} /><span>{v}</span></div>
            ))}
            {"texts" in a && a.texts?.map((t, i) => <p key={i} style={{ margin: 0, borderTop: "1px solid var(--color-rule)", paddingTop: 6 }}>{t}</p>)}
          </section>
        ))
      )}
    </main>
  );
}
