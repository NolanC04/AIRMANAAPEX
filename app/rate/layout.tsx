import { requireRole } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";
import { Footer } from "@/components/Footer";
export const dynamic = "force-dynamic";
export default async function RateLayout({ children }: { children: React.ReactNode }) {
  const p = await requireRole(["rater", "admin"]);
  return (<><AppHeader profile={p} view="Rater" />{children}<Footer /></>);
}
