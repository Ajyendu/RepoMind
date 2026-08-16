"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, X, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { SITE_GITHUB_URL, SITE_OWNER_EMAIL, SITE_OWNER_NAME } from "@/lib/site-owner";
import { ProductName } from "@/components/BrandMark";

export default function Footer() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || SITE_OWNER_EMAIL;

    const handleCopy = () => {
        navigator.clipboard.writeText(email);
        setCopied(true);
        toast.success("Email copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <footer className="relative z-10 py-8 border-t-2 border-black bg-white">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm">
                    © {new Date().getFullYear()}{" "}
                    <a
                        href={SITE_GITHUB_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                    >
                        {SITE_OWNER_NAME}
                    </a>
                    . <ProductName withTm className="text-sm" />.
                </p>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-[10px] font-bold tracking-[0.16em] uppercase"
                    >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        <span>Report a bug</span>
                    </button>
                </div>
            </div>

            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                                className="fixed inset-0 bg-black/40 z-[100]"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
                                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                                exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
                                className="fixed left-1/2 top-1/2 w-full max-w-md bg-white border-2 border-black p-6 z-[101]"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-display text-2xl">Get in touch</h3>
                                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black hover:text-white">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-neutral-700 mb-6 text-sm">
                                    Found a bug or have a feature request? Drop an email at:
                                </p>
                                <div className="flex items-center gap-2 p-3 border-2 border-black">
                                    <code className="flex-1 font-mono text-sm break-all">{email}</code>
                                    <button onClick={handleCopy} className="p-2 hover:bg-black hover:text-white">
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => window.location.href = `mailto:${email}`}
                                        className="px-4 py-2 bg-black text-white text-xs font-bold tracking-[0.16em] uppercase"
                                    >
                                        Send email
                                    </button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </footer>
    );
}
