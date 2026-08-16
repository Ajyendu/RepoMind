import { ReactNode } from "react";

export default function MagazineWindow({
    label,
    serial,
    children,
    className = "",
}: {
    label?: string;
    serial?: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <article className={`bg-white border-2 border-black ${className}`}>
            <div className="flex items-center justify-between px-3 py-2.5 border-b-2 border-black">
                <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full border border-black bg-white" />
                    <span className="h-2.5 w-2.5 rounded-full border border-black bg-white" />
                    <span className="h-2.5 w-2.5 rounded-full border border-black bg-black" />
                </div>
                <div className="flex items-center gap-3 text-[10px] font-semibold tracking-[0.18em] uppercase text-black">
                    {label ? <span>{label}</span> : null}
                    {serial ? <span className="text-neutral-500">[{serial}]</span> : null}
                </div>
            </div>
            {children}
        </article>
    );
}
