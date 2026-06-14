"use client";

import { cn } from "@/lib/utils";
import { getBadgeDefinition } from "@/lib/badges";

type BadgeIconProps = {
    slug: string;
    earned?: boolean;
    size?: "sm" | "md" | "lg";
    showLabel?: boolean;
    className?: string;
};

const sizeMap = {
    sm: { outer: 48, icon: "text-sm", label: "text-[10px]" },
    md: { outer: 64, icon: "text-base", label: "text-xs" },
    lg: { outer: 80, icon: "text-lg", label: "text-sm" },
};

export default function BadgeIcon({
    slug,
    earned = false,
    size = "md",
    showLabel = false,
    className,
}: BadgeIconProps) {
    const definition = getBadgeDefinition(slug);

    if (!definition) {
        return (
            <div
                className={cn(
                    "rounded-full bg-muted flex items-center justify-center",
                    !earned && "grayscale opacity-40",
                    className
                )}
                style={{ width: sizeMap[size].outer, height: sizeMap[size].outer }}
            >
                <span className="text-muted-foreground">?</span>
            </div>
        );
    }

    const { icon, colorFrom, colorTo, ringColor, name } = definition;
    const dimension = sizeMap[size].outer;

    return (
        <div className={cn("flex flex-col items-center gap-1.5", className)}>
            <div
                className={cn(
                    "relative rounded-full flex items-center justify-center shadow-md transition-all duration-500",
                    earned ? "scale-100 badge-earned-glow" : "grayscale opacity-45 scale-95"
                )}
                style={{
                    width: dimension,
                    height: dimension,
                    background: earned
                        ? `linear-gradient(135deg, ${colorFrom}, ${colorTo})`
                        : "linear-gradient(135deg, #d4d4d4, #737373)",
                    boxShadow: earned
                        ? `0 0 0 3px ${ringColor}, 0 4px 14px ${ringColor}66`
                        : "0 0 0 2px #a3a3a3, 0 2px 8px rgba(0,0,0,0.15)",
                }}
                title={name}
            >
                {/* Inner ring */}
                <div
                    className="absolute inset-1 rounded-full border-2 border-white/30"
                    aria-hidden
                />
                {/* Shine highlight */}
                {earned && (
                    <div
                        className="absolute top-1 left-1/4 w-1/2 h-1/4 rounded-full bg-white/25 blur-sm"
                        aria-hidden
                    />
                )}
                {/* Icon */}
                <span
                    className={cn(
                        "relative z-10 font-bold select-none leading-none",
                        sizeMap[size].icon,
                        earned ? "text-white drop-shadow-sm" : "text-neutral-600"
                    )}
                    style={{
                        fontSize: icon.length > 2 ? "0.65rem" : undefined,
                    }}
                >
                    {icon}
                </span>
                {/* Ribbon bottom */}
                {earned && (
                    <div
                        className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3/5 h-1.5 rounded-b-full opacity-80"
                        style={{ background: ringColor }}
                        aria-hidden
                    />
                )}
            </div>
            {showLabel && (
                <span
                    className={cn(
                        "font-medium text-center max-w-[72px] leading-tight",
                        sizeMap[size].label,
                        earned ? "text-foreground" : "text-muted-foreground"
                    )}
                >
                    {name}
                </span>
            )}
        </div>
    );
}
