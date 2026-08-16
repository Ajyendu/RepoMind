import Link from "next/link";

export function DottedO({ className = "" }: { className?: string }) {
    return (
        <span className={`relative inline-block ${className}`}>
            o
            <span className="absolute left-1/2 top-[48%] h-[0.22em] w-[0.22em] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
        </span>
    );
}

export function ProductName({
    className = "",
    withTm = false,
}: {
    className?: string;
    withTm?: boolean;
}) {
    return (
        <span className={`font-brand uppercase leading-none ${className}`}>
            Rep<DottedO />Mind
            {withTm ? <sup className="ml-0.5 text-[0.42em] tracking-normal">™</sup> : null}
        </span>
    );
}

export function BrandMark({
    href = "/",
    size = "md",
}: {
    href?: string;
    size?: "sm" | "md" | "lg";
}) {
    const sizeClass = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-xl";
    return (
        <Link href={href} className={`${sizeClass} text-black whitespace-nowrap`}>
            <ProductName withTm />
        </Link>
    );
}
