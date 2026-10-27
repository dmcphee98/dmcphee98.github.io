import { projects } from "@/data/projects";

export function ProjectCard({ p }: { p: typeof projects[0] }) {
    return (
        <a
            href="#"
            className="group block no-underline h-full px-[2.2rem] py-8 bg-surface/70 rounded-xl
                       border-2 border-transparent
                       transition-all duration-[220ms]
                       hover:bg-surface-dark hover:border-accent hover:-translate-y-1"
        >
            <div className="flex justify-between items-start mb-[10px]">
                <h3 className="text-xl font-extrabold text-content m-0">{p.title}</h3>
                <span className="text-xs text-muted tracking-[0.06em] pt-[3px]">{p.year}</span>
            </div>
            <p className="text-sm text-muted leading-[1.65] mb-[18px]">{p.desc}</p>
            <div className="flex gap-2 flex-wrap">
                {p.tags.map(t => (
                    <span key={t} className="text-xs font-bold tracking-[0.08em] px-[10px] py-[3px] rounded-[20px] bg-white/10 text-accent uppercase">
                        {t}
                    </span>
                ))}
            </div>
            <div className="mt-4 text-sm font-bold text-accent tracking-[0.04em] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                View project →
            </div>
        </a>
    );
}
