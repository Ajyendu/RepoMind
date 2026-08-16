import { auth } from "@/lib/auth";
import { isAdminUser } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!isAdminUser(session)) {
    redirect("/?error=unauthorized");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white text-black">
      <AdminSidebar />
      <main className="flex-1 overflow-auto relative">
        <div className="relative z-10 p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
