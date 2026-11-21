import Link from "next/link";
import { currentProfile } from "@/lib/auth";
import { store } from "@/lib/store";
import { env } from "@/lib/env";
import { CRISIS } from "@/lib/privacy";
import { ActionButton } from "@/components/Form";

interface Campaign { id: string; title: string; unit: string | null; flight: string | null; status: string; closes_at: string | null }
interface Ev { id: string; track_id: string; title: string; starts_at: string | null; location: string | null; description: string | null; capacity: number | null }

export default async function Unit() {
  const p = (await currentProfile())!;
  const db = store();
  const [campaigns, receipts, tracks, events, rsvps, mine, saidDid] = await Promise.all([
    db.list<Campaign>("feedback_campaigns", { status: "open" }),
    db.list<{ campaign_id: string }>("campaign_receipts", { user_id: p.id }),
    db.list<{ id: string; name: string; line: string }>("tracks"),
    db.list<Ev>("events"),
    db.list<{ event_id: string; user_id: string }>("rsvps"),
    db.list<{ id: string; kind: string; status: string; created_at: string }>("session_requests", { user_id: p.id }, { column: "created_at", ascending: false }),
    db.list<{ id: string; said: string; did: string; at: string }>("you_said_we_did", undefined, { column: "at", ascending: false }),
  ]);
  const done = new Set(receipts.map((r) => r.campaign_id));
  const inbox = campaigns.filter((c) => (!c.unit || c.unit === p.unit) && (!c.flight || c.flight === p.flight) && !done.has(c.id));
  return (
    <main className="page" style={{ display: "grid", gap: 14 }}>
      <h1 style={{ fontSize: 22, margin: "8px 0 0" }}>Unit</h1>
      <section className="card" style={{ display: "grid", gap: 8 }}>
        <span className="k">FEEDBACK · ANONYMOUS</span>
        {inbox.length ? inbox.map((c) => <Link key={c.id} href={`/app/unit/feedback/${c.id}`} style={{ fontWeight: 600, minHeight: 44, display: "flex", alignItems: "center" }}>{c.title} ›</Link>) : <p style={{ margin: 0 }}>Nothing open right now.</p>}
        <p className="help" style={{ margin: 0 }}>Your answers carry no name. Results stay hidden until at least five people respond.</p>
      </section>
      <section className="card" style={{ display: "grid", gap: 8 }}>
        <span className="k">GROWTH SESSIONS</span>
        <Link className="btn" href="/app/unit/request">Request a session</Link>
        {mine.map((r) => <Link key={r.id} href={`/app/unit/requests/${r.id}`}>{r.kind.replace("_", " ")} · {r.status} · {new Date(r.created_at).toLocaleDateString()}</Link>)}
        <p className="help" style={{ margin: 0 }}>{CRISIS}</p>
      </section>
      <section style={{ display: "grid", gap: 10 }}>
        <h2 style={{ fontSize: 16, margin: "6px 0 0" }}>Tracks</h2>
        {tracks.map((t) => (
          <div key={t.id} className="card" style={{ display: "grid", gap: 8 }}>
            <div><b>{t.name}</b><div className="help">{t.line}</div></div>
            {events.filter((e) => e.track_id === t.id).map((e) => {
              const going = rsvps.some((r) => r.event_id === e.id && r.user_id === p.id);
              const count = rsvps.filter((r) => r.event_id === e.id).length;
              const full = e.capacity != null && count >= e.capacity && !going;
              return (
                <div key={e.id} className="card" style={{ background: "var(--color-field)", display: "grid", gap: 6 }}>
                  <b>{e.title}</b>
                  <span className="help">{e.starts_at ? new Date(e.starts_at).toLocaleString() : <span className="gap">[NOLAN: date and time]</span>} · {e.location ?? <span className="gap">[NOLAN: location]</span>}{e.capacity ? ` · ${count}/${e.capacity}` : ""}</span>
                  {e.description && <span>{e.description}</span>}
                  <ActionButton ghost={going} endpoint="/api/events/rsvp" body={{ event_id: e.id, going: !going }} label={going ? "Cancel RSVP" : full ? "Full" : "RSVP"} />
                </div>
              );
            })}
          </div>
        ))}
        {env.discordInvite ? <a className="btn-ghost" href={env.discordInvite} rel="noopener">Join the Discord</a> : <p className="help">Discord link not set yet.</p>}
      </section>
      {saidDid.length > 0 && (
        <section className="card" style={{ display: "grid", gap: 8 }}>
          <span className="k">YOU SAID · WE DID</span>
          {saidDid.map((x) => <p key={x.id} style={{ margin: 0 }}><b>You said:</b> {x.said}<br /><b>We did:</b> {x.did}</p>)}
        </section>
      )}
    </main>
  );
}
