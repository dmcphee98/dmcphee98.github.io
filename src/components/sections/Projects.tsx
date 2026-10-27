import { BackgroundBeams } from "@/components/backgrounds/BackgroundBeams";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";
import { GITHUB_URL } from "@/data/contact";

export function Projects() {
    return (
        <section id="projects" className="relative overflow-hidden bg-surface-dark pt-24 px-5 pb-16 md:pt-24 md:px-10 md:pb-28">
            <BackgroundBeams />
            <div className="relative max-w-[1100px] mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <Reveal>
                        <SectionHeading label="Selected work">Projects</SectionHeading>
                    </Reveal>
                    <Reveal>
                        <a href={GITHUB_URL} className="text-sm font-bold text-muted no-underline tracking-[0.04em] border-b border-muted pb-[2px]">
                            All on GitHub →
                        </a>
                    </Reveal>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {projects.map((p, i) => (
                        <Reveal key={i} delay={i * 120}>
                            <ProjectCard p={p} />
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
