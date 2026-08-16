"use client";

import { useSession, signOut } from "next-auth/react";
import { Github, LogOut, LayoutDashboard, User, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AuthButton() {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (status === "loading") {
        return (
            <div className="h-9 w-24 bg-neutral-100 animate-pulse rounded-full" />
        );
    }

    if (session) {
        return (
            <div className="relative">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center overflow-hidden rounded-xl"
                >
                    <div className="w-8 h-8 md:w-9 md:h-9 overflow-hidden rounded-xl">
                        {session.user?.image ? (
                            <Image
                                src={session.user.image}
                                alt={session.user.name || "User"}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                                <User className="w-4 h-4 text-black" />
                            </div>
                        )}
                    </div>
                </button>

                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="fixed inset-0 z-40"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute right-0 mt-2 w-48 bg-white border-2 border-black p-2 z-50"
                            >
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 px-3 py-2 text-sm text-black hover:bg-black hover:text-white transition-colors font-medium"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </Link>
                                <div className="h-px bg-black my-1" />
                                <button
                                    onClick={() => {
                                        signOut();
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-black hover:bg-black hover:text-white transition-colors font-medium"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out</span>
                                </button>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-[10px] md:text-xs font-bold tracking-[0.16em] uppercase hover:bg-neutral-800"
        >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign in</span>
            <Github className="w-3.5 h-3.5 sm:hidden" />
        </Link>
    );
}
