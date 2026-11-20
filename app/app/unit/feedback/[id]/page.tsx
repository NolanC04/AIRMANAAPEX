import Link from "next/link";
import { notFound } from "next/navigation";
import { currentProfile } from "@/lib/auth";
import { store } from "@/lib/store";
import type { Question } from "@/lib/privacy";
import { FeedbackForm } from "./FeedbackForm";

export default async function Feedback({ params }: { params: Promise<{ id: string }> }) {
  const p = (await currentProfile())!;
  const c = await store().get<{ id: string; title: string; form_id: string; status: string }>("feedback_campaigns", { id: (await params).id });
  if (!c || c.status !== "open") notFound();
  const done = await store().get("campaign_receipts", { campaign_id: c.id, user_id: p.id });
  const form = await store().get<{ questions: Question[] }>("feedback_forms", { id: c.form_id });
  return (
    <main className="page" style={{ display: "grid", gap: 14 }}>
      <h1 style={{ fontSize: 22, margin: "8px 0 0" }}>{c.title}</h1>
      {done ? <p className="card">You&apos;ve already answered this one. Thank you.</p> : <FeedbackForm campaignId={c.id} questions={form?.questions ?? []} />}
      <Link href="/app/unit/request" className="help">Want to talk? Request a session (separate from these anonymous answers).</Link>
    </main>
  );
}
