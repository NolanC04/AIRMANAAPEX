import { requireRole } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";
import { Footer } from "@/components/Footer";
export const dynamic = "force-dynamic";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const p = await requireRole(["admin"]);
  return (<><AppHeader profile={p} view="Admin" />{children}<Footer /></>);
}
