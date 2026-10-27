import { useState, useEffect, useRef } from "react";
import { useScrollY } from "@/hooks/useScrollY";
import { useTypewriter } from "@/hooks/useTypewriter";
import { JOB_TITLES } from "@/data/skills";
import { scrollToSection } from "@/lib/utils";

export function Hero() {
    const scrollY = useScrollY();
    const [heroH, setHeroH] = useState(0);
    const heroRef = useRef<HTMLDivElement>(null);
    const typed = useTypewriter(JOB_TITLES);

    useEffect(() => {
        const measure = () => { if (heroRef.current) setHeroH(heroRef.current.offsetHeight); };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    const fade = heroH > 0 ? Math.min(scrollY / (heroH * 0.5), 1) : 0;
    const parallax = scrollY * 0.36;

    return (
        // Mobile: the 9:16 photo is placed so the top of the head (44.5% down the image) sits at
        // or below 290px + 4cqw, just under the text block. Normally that's just the
        // bottom-anchored cover fit. On wide or short screens it shows more sky instead, and if
        // that isn't enough it scales up and crops the feet.
        // These are unregistered custom properties, so the cq units resolve in each child's context.
        <div
            ref={heroRef}
            style={{
                "--hero-img-h": "max(100cqh, 177.78cqw, calc((290px + 4cqw) / 0.445))",
                "--hero-img-top": "clamp(calc(100cqh - var(--hero-img-h)), calc(290px + 4cqw - 0.445 * var(--hero-img-h)), 0px)",
                "--hero-head-y": "calc(var(--hero-img-top) + 0.445 * var(--hero-img-h))",
            } as React.CSSProperties}
            className="sticky top-0 z-1 h-screen overflow-hidden [container-type:size]"
        >
            <picture>
                <source media="(max-width: 767px)" srcSet="/hero_mobile.webp" />
                <img
                    src="/hero.webp" alt=""
                    style={{ transform: `translateY(${-parallax}px)` }}
                    className="absolute left-0 right-0 w-full top-(--hero-img-top) h-(--hero-img-h) md:top-0 md:h-full object-cover object-[center_bottom] md:object-[70%_bottom] will-change-transform"
                />
            </picture>
            <div
                style={{ background: `linear-gradient(to right, rgba(8,13,20,${0.8 + fade * 0.15}) 0%, rgba(8,13,20,${0.2 + fade * 0.35}) 50%, rgba(8,13,20,${fade * 0.5}) 100%)` }}
                className="absolute inset-0 hidden md:block"
            />
            <div
                style={{ background: `rgba(8,13,20,${fade * 0.5})` }}
                className="absolute inset-0"
            />
            <div
                style={{
                    opacity: Math.max(0, 1 - fade * 1.7),
                    transform: `translateY(${fade * -48}px)`,
                }}
                className="absolute inset-0 flex"
            >
                {/* Desktop: the text block mirrors the subject in the photo. It ends at the centre,
                    and its left margin equals the gap between the subject's right edge and the
                    screen's right edge.
                    The 16:9 image is object-cover'd at 70% across. Its rendered width is
                    D = max(W, 16/9·H), and the subject's right edge (76% of the image) lands at
                    0.7·(W − D) + 0.76·D = 0.7W + 0.06D. The margin is therefore 0.3W − 0.06D, and
                    the block width is 0.5W − margin = 0.2W + 0.06D. W and H are the hero's own size
                    (container units, so the scrollbar is excluded). The name is sized so that
                    "McPhee." (≈4.06em wide) fills the block exactly. */}
                {/* Mobile: the text is centred in the sky, between the nav and the top of the head.
                    The mobile sky is near-white, so the text is dark there with no overlay. */}
                <div className="w-full flex flex-col justify-center pt-14 pb-[calc(100cqh-var(--hero-head-y)+1rem)] px-5 md:pt-0 md:pb-0 md:px-0">
                    <div
                        style={{ "--hero-text-w": "calc(20cqw + max(6cqw, 10.667cqh))" } as React.CSSProperties}
                        className="w-full max-w-[1100px] mx-auto text-center md:text-left md:max-w-none md:mx-0 md:ml-[calc(50cqw-var(--hero-text-w))] md:w-(--hero-text-w)"
                    >
                        <h1 className="font-black text-dark md:text-content m-0 mb-2 md:mb-4 leading-[0.95] tracking-[-0.03em] text-[length:clamp(2.75rem,1.5rem_+_5.5vw,7rem)] md:text-[length:max(2.75rem,calc(var(--hero-text-w)/4.06))]">
                            Dean<br />McPhee.
                        </h1>
                        <div
                            style={{ fontSize: "clamp(1rem, 0.25rem + 1.25vw, 1.5rem)" }}
                            className="font-semibold text-accent mb-4 md:mb-7 tracking-[0.01em] min-h-[1.4em]"
                        >
                            {typed}<span className="animate-blink font-extralight ml-px">|</span>
                        </div>
                        <p
                            style={{ fontSize: "clamp(0.9375rem, 0.5rem + 0.7vw, 1.0625rem)" }}
                            className="font-normal text-on-light md:text-white/72 m-0 md:mb-9 leading-[1.65]"
                        >
                            <span className="block text-balance">I build thoughtful software</span>
                            <span className="block">and occasionally disappear</span>
                            <span className="block">into the mountains.</span>
                        </p>
                        <button
                            onClick={() => scrollToSection("about")}
                            className="hidden md:inline-block bg-surface text-content border-0 rounded-lg px-8 py-[13px] text-sm font-bold cursor-pointer font-[inherit] tracking-[0.02em]"
                        >
                            View my work
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
