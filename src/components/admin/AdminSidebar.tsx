"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  ExternalLink,
  ChevronLeft,
  BarChart2
} from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { BrandMark } from "@/components/BrandMark";

const menuItems = [
  { icon: LayoutDashboard, label: "Admin Home", href: "/admin" },
  { icon: BarChart2, label: "Analytics", href: "/admin/stats" },
  { icon: FileText, label: "Blog Posts", href: "/admin/blog" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`hidden md:flex flex-col border-r-2 border-black bg-white transition-all duration-300 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-6 flex items-center justify-between border-b-2 border-black">
        {!isCollapsed && <BrandMark size="sm" />}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-500 hover:text-black"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform ${
              isCollapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${
                isActive
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-100"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive ? "text-white" : "text-neutral-600"
                }`}
              />
              {!isCollapsed && (
                <div className="flex items-center justify-between flex-1">
                  <span className="font-medium">{item.label}</span>
                </div>
              )}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t-2 border-black">
            <Link
              href="/blog"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-all group"
            >
              <ExternalLink className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
              {!isCollapsed && <span className="font-medium">View Public Blog</span>}
            </Link>
        </div>
      </nav>

      <div className="p-4 border-t-2 border-black">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center gap-3 px-3 py-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {!isCollapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
