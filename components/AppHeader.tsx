import Link from "next/link";
import { ViewMenu } from "./ViewMenu";
import { Wordmark } from "./Logo";
import type { Profile } from "@/lib/auth";

export function AppHeader({ profile, view }: { profile: Profile; view: "Learner" | "Facilitator" | "Admin" | "Rater" }) {
  const staff = profile.role === "facilitator" || profile.role === "admin";
  const dark = view === "Admin";
  return (
    <header style={{ background: dark ? "var(--color-ink)" : "transparent", borderBottom: dark ? 0 : "1px solid var(--color-border)" }}>
      <div style={{ maxWidth: view === "Learner" ? 560 : 1280, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, filter: dark ? "invert(1) hue-rotate(180deg)" : undefined }}>
        <Link href={view === "Learner" ? "/app" : view === "Admin" ? "/admin" : view === "Rater" ? "/rate" : "/facilitator"} style={{ textDecoration: "none" }}><Wordmark small /></Link>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {staff && view !== "Rater" && <ViewMenu current={view} isAdmin={profile.role === "admin"} />}
          <form action="/api/auth/signout" method="post"><button className="help" style={{ background: "none", border: 0, cursor: "pointer", textDecoration: "underline", minHeight: 44 }}>Sign out</button></form>
        </div>
      </div>
    </header>
  );
}
