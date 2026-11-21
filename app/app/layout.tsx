import { requireRole } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";
import { LearnerNav } from "@/components/LearnerNav";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  const p = await requireRole(["learner", "assistant", "facilitator", "admin", "comparison"]);
  return (
    <>
      <AppHeader profile={p} view="Learner" />
      {children}
      <Footer />
      <LearnerNav />
    </>
  );
}
