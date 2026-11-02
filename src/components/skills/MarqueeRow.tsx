import { useState } from "react";
import type { CSSProperties } from "react";
import type { SkillItem } from "@/types/skills";
import { SkillChip } from "./SkillChip";

export function MarqueeRow({ items, reverse = false, duration = 32 }: {
    items: SkillItem[]; reverse?: boolean; duration?: number;
}) {
    const [paused, setPaused] = useState(false);
    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="overflow-hidden py-[5px]"
            style={{
                WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                // Own compositing layer, so Safari applies the mask to the animated track
                transform: "translateZ(0)",
            }}
        >
            <div
                style={{
                    "--marquee-duration": `${duration}s`,
                    animationPlayState: paused ? "paused" : "running",
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                } as CSSProperties}
                className={`flex w-max ${reverse ? "animate-marquee-right" : "animate-marquee-left"}`}
            >
                {/* Each copy carries its own trailing gap, so a one-third shift lands exactly on the next copy */}
                {[0, 1, 2].map(copy => (
                    <div key={copy} className="flex gap-3 pr-3" aria-hidden={copy > 0}>
                        {items.map(skill => <SkillChip key={skill.name} skill={skill} />)}
                    </div>
                ))}
            </div>
        </div>
    );
}
