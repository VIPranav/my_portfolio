import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
export const dynamic = "force-dynamic";
export default async function Protected({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await getAdmin())) redirect("/admin/login");
  return (
    <div className="admin-shell">
      <Sidebar />
      <main id="main-content" className="admin-main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
