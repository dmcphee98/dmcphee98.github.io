import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MarqueeRow } from "@/components/skills/MarqueeRow";
import { FeaturedSkillCard } from "@/components/skills/FeaturedSkillCard";
import { FEATURED_SKILLS, SKILL_ROWS } from "@/data/skills";

export function Skills() {
    return (
        <section id="skills" className="relative overflow-hidden bg-surface-dark pt-24 px-5 pb-16 md:pt-24 md:px-10 md:pb-28">
            <div className="max-w-[1100px] mx-auto mb-12">
                <Reveal>
                    <SectionHeading label="Technologies">My Stack</SectionHeading>
                </Reveal>
            </div>
            <div className="max-w-[1100px] mx-auto mb-16 grid grid-cols-1 gap-4 md:grid-cols-3">
                {FEATURED_SKILLS.map((skill, i) => (
                    <Reveal key={skill.name} delay={i * 120}>
                        <FeaturedSkillCard skill={skill} />
                    </Reveal>
                ))}
            </div>
            <div className="max-w-[1100px] mx-auto">
                <Reveal>
                    <p className="text-xs font-bold text-content-dim tracking-[0.14em] uppercase mb-5">
                        The wider toolkit
                    </p>
                </Reveal>
                <div className="flex flex-col gap-3.5">
                    <MarqueeRow items={SKILL_ROWS[0]} duration={42} />
                    <MarqueeRow items={SKILL_ROWS[1]} reverse duration={38} />
                    <MarqueeRow items={SKILL_ROWS[2]} duration={44} />
                </div>
            </div>
        </section>
    );
}
