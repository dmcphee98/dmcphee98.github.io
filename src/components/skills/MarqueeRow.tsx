import { useState } from "react";
import type { CSSProperties } from "react";
import type { SkillItem } from "@/types/skills";
import { SkillChip } from "./SkillChip";

export function MarqueeRow({ items, reverse = false, duration = 32 }: {
    items: SkillItem[]; reverse?: boolean; duration?: number;
}) {
    const [paused, setPaused] = useState(false);
    const tripled = [...items, ...items, ...items];
    return (
        <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="overflow-hidden py-[5px]"
            style={{
                WebkitMaskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            }}
        >
            <div
                style={{
                    "--marquee-duration": `${duration}s`,
                    animationPlayState: paused ? "paused" : "running",
                } as CSSProperties}
                className={`flex gap-3 w-max ${reverse ? "animate-marquee-right" : "animate-marquee-left"}`}
            >
                {tripled.map((skill, i) => <SkillChip key={i} skill={skill} />)}
            </div>
        </div>
    );
}
