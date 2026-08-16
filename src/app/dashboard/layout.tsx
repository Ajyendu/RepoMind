"use client";

import { useSession } from "next-auth/react";
import {
    LayoutDashboard,
    History,
    Star,
    ChevronLeft,
    Menu,
    LogOut,
    BookOpen
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { BrandMark } from "@/components/BrandMark";

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
    { icon: History, label: "Recent Scans", href: "/dashboard/scans" },
    { icon: BookOpen, label: "My Repos", href: "/dashboard/repos" },
    { icon: Star, label: "Starred Repos", href: "/dashboard/starred" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();
    const sessionUserId = (session?.user as { id?: string } | undefined)?.id;
    const hasInvalidSession = status !== "loading" && Boolean(session?.user) && !sessionUserId;

    useEffect(() => {
        if (hasInvalidSession) {
            signOut({ callbackUrl: "/?error=invalid_session" });
        }
    }, [hasInvalidSession]);

    if (hasInvalidSession) {
        return (
            <div className="min-h-screen bg-white text-black flex items-center justify-center p-6">
                <div className="max-w-md w-full border-2 border-black bg-white p-6 text-center">
                    <h1 className="text-xl font-semibold mb-2 text-gray-900">Session Validation Failed</h1>
                    <p className="text-gray-600 text-sm">
                        Your session is invalid. Redirecting you to sign in again.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-white text-black">
            <aside
                className={`hidden md:flex flex-col border-r-2 border-black bg-white transition-all duration-300 z-50 ${isCollapsed ? 'w-20' : 'w-64'}`}
            >
                <div className="p-6 flex items-center justify-between border-b-2 border-black">
                    {!isCollapsed && (
                        <BrandMark size="sm" />
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
                    >
                        <ChevronLeft className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 transition-all group ${isActive
                                    ? 'bg-black text-white'
                                    : 'text-gray-600 hover:text-black hover:bg-neutral-100'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {!isCollapsed && (
                                    <div className="flex items-center justify-between flex-1">
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        {!isCollapsed && <span className="font-medium">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b-2 border-black px-4 flex items-center justify-between z-40">
                <BrandMark size="sm" />
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white border-r-2 border-black z-70 p-6 flex flex-col md:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <BrandMark size="sm" />
                                <button onClick={() => setIsMobileOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                            </div>
                            <nav className="flex-1 space-y-4">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={`flex items-center gap-3 p-3 ${pathname === item.href ? 'bg-black text-white' : 'text-gray-600'}`}
                                    >
                                        <item.icon className="w-6 h-6" />
                                        <div className="flex items-center justify-between flex-1">
                                            <span className="font-medium text-lg">{item.label}</span>
                                        </div>
                                    </Link>
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <main className="flex-1 pt-16 md:pt-0 overflow-auto relative">
                <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
