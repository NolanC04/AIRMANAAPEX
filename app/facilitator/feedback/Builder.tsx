"use client";
import { useState } from "react";
import { postJSON } from "@/lib/fetchWithRetry";
import type { Question } from "@/lib/privacy";

export function FeedbackBuilder() {
  const [title, setTitle] = useState("");
  const [unit, setUnit] = useState("");
  const [flight, setFlight] = useState("");
  const [qs, setQs] = useState<Question[]>([{ id: "q1", kind: "scale", prompt: "" }]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const set = (i: number, patch: Partial<Question>) => setQs(qs.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  return (
    <div style={{ display: "grid", gap: 12, marginTop: 10 }}>
      <input className="in" placeholder="Title (e.g. Next month's block topic)" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div style={{ display: "flex", gap: 8 }}><input className="in" placeholder="Unit (blank = all)" value={unit} onChange={(e) => setUnit(e.target.value)} /><input className="in" placeholder="Flight (blank = all)" value={flight} onChange={(e) => setFlight(e.target.value)} /></div>
      {qs.map((q, i) => (
        <div key={q.id} className="card" style={{ background: "var(--color-field)", display: "grid", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <select className="in" style={{ maxWidth: 180 }} value={q.kind} onChange={(e) => set(i, { kind: e.target.value as Question["kind"] })}>
              <option value="scale">Scale 1–5</option><option value="choice">Multiple choice</option><option value="text">Short text</option>
            </select>
            <input className="in" placeholder="Question" value={q.prompt} onChange={(e) => set(i, { prompt: e.target.value })} />
          </div>
          {q.kind === "choice" && <input className="in" placeholder="Options, separated by |" value={(q.options ?? []).join("|")} onChange={(e) => set(i, { options: e.target.value.split("|") })} />}
        </div>
      ))}
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-ghost" onClick={() => setQs([...qs, { id: `q${qs.length + 1}`, kind: "text", prompt: "" }])}>Add question</button>
        <button className="btn" disabled={busy} onClick={async () => {
          setBusy(true);
          try { await postJSON("/api/feedback/forms", { title, unit, flight, questions: qs.map((q) => ({ ...q, options: q.options?.map((o) => o.trim()).filter(Boolean) })) }); window.location.reload(); } catch (e) { setErr((e as Error).message); setBusy(false); }
        }}>{err ? "Retry" : "Send campaign"}</button>
      </div>
      {err && <p role="alert" className="err">{err}</p>}
    </div>
  );
}
