import type { CSSProperties } from "react";
import type { FeaturedSkill } from "@/types/skills";
import { useHoverAnimations } from "@/hooks/useHoverAnimations";

export function FeaturedSkillCard({ skill }: { skill: FeaturedSkill }) {
    // The icon animates only while the card is hovered
    const { ref, onMouseEnter, onMouseLeave } = useHoverAnimations<HTMLDivElement>();
    return (
        <div
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{ "--skill-color": skill.color } as CSSProperties}
            className="group h-full px-8 py-9 bg-surface/70 rounded-xl
                       border-2 border-transparent
                       transition-all duration-[220ms]
                       hover:bg-surface hover:border-(--skill-color)/40 hover:-translate-y-1"
        >
            {/* Mobile: title left, icon right on one row. Desktop: icon stacked above title */}
            <div className="flex flex-row-reverse items-center justify-between mb-4 md:mb-2.5 md:flex-col md:items-start md:justify-start">
                {/* Icon sizes in em, so the font size sets it: 28px mobile, 40px desktop */}
                <div className="w-12 h-12 text-[28px] rounded-xl shrink-0 md:w-18 md:h-18 md:text-[40px] md:rounded-2xl md:mb-6 flex items-center justify-center bg-white/5 text-(--skill-color)">
                    <skill.Icon />
                </div>
                <h3 className="text-2xl font-extrabold text-content m-0">{skill.name}</h3>
            </div>
            <p className="text-sm text-muted leading-[1.65] m-0">{skill.desc}</p>
        </div>
    );
}
