import type { CSSProperties } from "react";
import type { SkillItem } from "@/types/skills";

export function SkillChip({ skill }: { skill: SkillItem }) {
    return (
        <div
            style={{ "--skill-color": skill.color } as CSSProperties}
            className="group flex items-center gap-2.5 px-5 py-3
                       bg-white/5 border border-white/8 rounded-[40px]
                       shrink-0 select-none cursor-default whitespace-nowrap
                       transition-all duration-200
                       hover:bg-white/10 hover:border-accent/50
                       hover:-translate-y-0.75 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]"
        >
            <span className="flex text-content-dim group-hover:text-(--skill-color) transition-colors duration-200">
                <skill.Icon size={18} />
            </span>
            <span className="text-sm font-semibold tracking-[0.02em] text-muted group-hover:text-content transition-colors duration-200">
                {skill.name}
            </span>
        </div>
    );
}
