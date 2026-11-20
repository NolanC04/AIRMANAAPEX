import { store } from "@/lib/store";
import { modules, settings } from "@/lib/data";
import { code, gap } from "@/lib/program";
import type { FieldChange } from "@/lib/diff";
import { Form, ActionButton } from "@/components/Form";
import { ApproveProposal, BundleUpload } from "./Material";

export default async function Admin() {
  const db = store();
  const [mods, proposals, laws, s] = await Promise.all([
    modules(),
    db.list<{ id: string; module_number: number; source: string; changes: FieldChange[]; status: string; at: string }>("import_proposals", { status: "pending" }, { column: "module_number" }),
    db.list<{ id: string; module_number: number; text: string; approved: boolean }>("closing_laws"),
    settings(),
  ]);
  return (
    <main className="page-wide" style={{ display: "grid", gap: 18 }}>
      <section className="card" style={{ display: "grid", gap: 10 }}>
        <span className="k">MATERIAL · M01–M24</span>
        <table className="table"><thead><tr><th>Module</th><th>Title</th><th>Status</th><th>Closing Law</th></tr></thead><tbody>
          {mods.map((m) => {
            const law = laws.find((l) => l.id === m.closing_law_id);
            return <tr key={m.id}><td>{code(m.number)}</td><td>{m.content.title ?? <span className="gap">{gap("title")}</span>}</td><td>{m.status === "published" ? `Published v${m.version}` : "Draft"}</td><td>{law?.approved ? "Authored" : "Not yet authored"}</td></tr>;
          })}
        </tbody></table>
      </section>
      <section className="card" style={{ display: "grid", gap: 10 }}>
        <span className="k">IMPORT CONTENT</span>
        <p className="help" style={{ margin: 0 }}>Upload a JSON bundle (<code>{"{ modules: [{ n, title, … }] }"}</code>). Each module becomes a proposal with a diff. Nothing saves until you approve it. <code>npm run bundle:pilot</code> builds one from the pilot app&apos;s content.</p>
        <BundleUpload />
      </section>
      {proposals.length > 0 && (
        <section style={{ display: "grid", gap: 12 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>Pending proposals ({proposals.length})</h2>
          {proposals.map((p) => (
            <article key={p.id} className="card" style={{ display: "grid", gap: 8 }}>
              <b>{code(p.module_number)} · from {p.source}</b>
              <table className="table"><thead><tr><th>Field</th><th>Before</th><th>After</th></tr></thead><tbody>
                {p.changes.map((c) => <tr key={c.field}><td>{c.field}</td><td style={{ color: "var(--color-muted)", maxWidth: 360 }}>{c.before == null ? "—" : JSON.stringify(c.before).slice(0, 300)}</td><td style={{ maxWidth: 420 }}>{JSON.stringify(c.after).slice(0, 400)}</td></tr>)}
              </tbody></table>
              <ApproveProposal id={p.id} />
            </article>
          ))}
        </section>
      )}
      <section className="card" style={{ display: "grid", gap: 10 }}>
        <span className="k">CLOSING LAWS · NOLAN WRITES THESE; AI MAY NOT AUTHOR THEM</span>
        <Form endpoint="/api/laws" reload submit="Save Closing Law" fields={[
          { name: "n", label: "Module", type: "select", options: mods.map((m) => [String(m.number), `${code(m.number)} ${m.content.title ?? ""}`] as [string, string]) },
          { name: "text", label: "Closing Law (verbatim)", type: "textarea", required: true },
          { name: "attest", label: "I, Nolan, wrote this Closing Law myself.", type: "checkbox", required: true },
        ]} />
      </section>
      <section className="card" style={{ display: "grid", gap: 10 }}>
        <span className="k">SETTINGS</span>
        <p style={{ margin: 0 }}>Completed modules stay readable after class: <b>{s.modules_readable_after_completion ? "Yes" : "No"}</b> <span className="gap">[NOLAN: decide]</span></p>
        <ActionButton ghost endpoint="/api/settings" body={{ modules_readable_after_completion: !s.modules_readable_after_completion }} label={s.modules_readable_after_completion ? "Turn off" : "Turn on"} />
        <p style={{ margin: 0 }}>Daily reps between sessions: <b>{s.daily_reps_between_sessions ? "On" : "Off"}</b></p>
        <ActionButton ghost endpoint="/api/settings" body={{ daily_reps_between_sessions: !s.daily_reps_between_sessions }} label={s.daily_reps_between_sessions ? "Turn off" : "Turn on"} />
      </section>
    </main>
  );
}
