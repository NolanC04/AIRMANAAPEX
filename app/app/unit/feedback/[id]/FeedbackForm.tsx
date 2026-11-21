"use client";
import { useState } from "react";
import { postJSON } from "@/lib/fetchWithRetry";
import type { Question } from "@/lib/privacy";

export function FeedbackForm({ campaignId, questions }: { campaignId: string; questions: Question[] }) {
  const [a, setA] = useState<Record<string, string | number>>({});
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  if (state === "done") return <p className="card" role="status">Received. No name is attached to your answers.</p>;
  return (
    <form className="card" style={{ display: "grid", gap: 16 }} onSubmit={async (e) => {
      e.preventDefault();
      setState("busy");
      try { await postJSON("/api/feedback/submit", { campaign_id: campaignId, answers: a }); setState("done"); } catch (x) { setErr((x as Error).message); setState("error"); }
    }}>
      {questions.map((q) => (
        <fieldset key={q.id} style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="serif" style={{ fontSize: 18, marginBottom: 8 }}>{q.prompt}</legend>
          {q.kind === "text" ? (
            <textarea className="in" rows={3} value={String(a[q.id] ?? "")} onChange={(e) => setA({ ...a, [q.id]: e.target.value })} />
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(q.kind === "scale" ? ["1", "2", "3", "4", "5"] : q.options ?? []).map((o) => (
                <label key={o} className="pill" style={{ minHeight: 44, padding: "0 14px", cursor: "pointer", ...(String(a[q.id]) === o ? { background: "var(--color-primary)", color: "var(--color-on-primary)" } : {}) }}>
                  <input type="radio" name={q.id} value={o} checked={String(a[q.id]) === o} onChange={() => setA({ ...a, [q.id]: q.kind === "scale" ? Number(o) : o })} style={{ position: "absolute", opacity: 0 }} />{o}
                </label>
              ))}
            </div>
          )}
        </fieldset>
      ))}
      {state === "error" && <p role="alert" className="err">{err}</p>}
      <button className="btn" disabled={state === "busy"}>{state === "error" ? "Retry" : "Send anonymously"}</button>
    </form>
  );
}
