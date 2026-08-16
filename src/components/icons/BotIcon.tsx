import { cn } from "@/lib/utils";

export function BotIcon({ className }: { className?: string }) {
    return (
        // Serve the source PNG as-is so Next Image optimization cannot crop or recolor it.
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src="/no-bg-repomind.png"
            alt=""
            width={40}
            height={40}
            className={cn("block h-10 w-10 max-h-10 max-w-10 object-contain", className)}
        />
    );
}
