import React, { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { Label } from "@/components/ui/Label";
import { CONTACT_LINKS } from "@/data/contact";
import { MountainLine } from "@/components/backgrounds/MountainLine";

const FACTS = [
    { label: "Based in",   value: "Melbourne, AU" },
    { label: "Focus",      value: "Full-stack" },
    { label: "Education",  value: "Master of Engineering" },
    { label: "Experience", value: "4+ years" },
];

export function About() {
    const tiltRef = useRef<HTMLDivElement>(null);
    const factsRef = useRef<HTMLDivElement>(null);
    const [factsH, setFactsH] = useState(0);

    // The icon card mirrors the facts block's height, which changes as values wrap
    useEffect(() => {
        const el = factsRef.current;
        if (!el) return;
        const measure = () => setFactsH(el.offsetHeight);
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        window.addEventListener("resize", measure);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", measure);
        };
    }, []);

    const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = tiltRef.current;
        if (!el) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        el.style.transform = `perspective(500px) rotateY(${x * 24}deg) rotateX(${-y * 24}deg) scale(1.04)`;
    };

    const handleTiltReset = () => {
        if (tiltRef.current) tiltRef.current.style.transform = "";
    };

    return (
        <section id="about" className="relative bg-page-light rounded-3xl px-5 pt-16 pb-24 md:px-10 md:pt-28 md:pb-24">
            <div className="max-w-[1100px] mx-auto">
                <div className="grid grid-cols-1 gap-8 items-start md:grid-cols-2 md:gap-16 md:items-stretch">
                    {/* Left column */}
                    <div>
                        <Reveal><Label onDark={false}>About me</Label></Reveal>
                        <Reveal delay={60}>
                            <h2
                                style={{ fontSize: "clamp(2.375rem, 5vw, 3.75rem)" }}
                                className="font-black leading-none tracking-[-0.03em] mb-7 text-dark"
                            >
                                Hello,<br />I'm Dean.
                            </h2>
                        </Reveal>
                        <Reveal delay={140}>
                            <p className="text-base font-normal leading-[1.75] text-on-light mb-4.5">
                                A software engineer based in Melbourne with a passion for building systems that are fast, reliable, and genuinely useful. When I'm not writing code, I'm usually somewhere remote with a camera.
                            </p>
                        </Reveal>
                        <Reveal delay={200}>
                            <p className="text-base leading-[1.75] text-on-light mb-9">
                                I care deeply about clean architecture, developer experience, and shipping things that last.
                            </p>
                        </Reveal>
                        <Reveal delay={220}>
                            <div ref={factsRef} className="grid grid-cols-2 auto-rows-fr gap-2.5">
                                {FACTS.map(({ label, value }) => (
                                    <div key={label} className="flex flex-col bg-white rounded-[10px] p-[16px_18px] shadow-[0_2px_12px_rgba(8,13,20,0.07)]">
                                        <p className="text-xs font-bold text-on-light-dim m-0 mb-1.25 tracking-widest uppercase">{label}</p>
                                        <p className="flex-1 flex items-center text-base font-extrabold text-dark m-0">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                    {/* Right column — photo + icon buttons (desktop only). Size containment keeps it from
                        adding height, so it spans the left column exactly: photo top level with the label,
                        icons bottom level with the facts. Icons overlap the photo from lg, sit below it on narrower screens. */}
                    <Reveal delay={100} className="hidden md:block relative [container-type:size]">
                        <div
                            className="relative mx-auto aspect-square w-[min(100cqw,100cqh_-_var(--icons-h,10rem)_-_1rem)] lg:w-[min(100cqw,100cqh)] lg:mr-0"
                            style={factsH ? { "--icons-h": `${factsH}px` } as React.CSSProperties : undefined}
                        >
                            <div className="relative h-full rounded-full overflow-hidden">
                                <img
                                    src="/headshot.webp"
                                    alt="Dean McPhee"
                                    className="w-full h-full object-cover block grayscale"
                                />
                                <div className="absolute inset-0" style={{ background: "#1E3A58", mixBlendMode: "color", opacity: 0.4 }} />
                            </div>
                        </div>
                        <div
                            ref={tiltRef}
                            onMouseMove={handleTiltMove}
                            onMouseLeave={handleTiltReset}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 grid grid-cols-2 grid-rows-2 gap-2 bg-surface-dark rounded-2xl p-3 shadow-[0_8px_32px_rgba(8,13,20,0.35)]"
                            style={{ transition: "transform 0.2s ease", width: factsH || undefined, height: factsH || undefined }}
                        >
                            <ContactIcons size={factsH ? "w-full h-full" : "w-16 h-16"} />
                        </div>
                    </Reveal>
                </div>
                <MountainLine className="mt-16 md:mt-20 text-on-light/40" />
            </div>
            {/* Mobile contact icons — straddle About / Projects boundary */}
            <div className="absolute bottom-0 inset-x-0 flex justify-center translate-y-1/2 z-10 md:hidden">
                <div className="flex gap-2 bg-surface rounded-2xl p-3 shadow-[0_8px_32px_rgba(8,13,20,0.35)]">
                    <ContactIcons size="w-14 h-14" />
                </div>
            </div>
        </section>
    );
}

function ContactIcons({ size }: { size: string }) {
    return CONTACT_LINKS.map(({ icon, href, label, cls, download }) => (
        <a
            key={label}
            href={href}
            {...(download ? { download } : {})}
            aria-label={label}
            className={`${size} rounded-xl flex items-center justify-center transition-colors duration-200 ${cls}`}
        >
            {icon}
        </a>
    ));
}
