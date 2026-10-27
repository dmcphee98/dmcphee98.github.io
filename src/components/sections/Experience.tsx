import { useRef, useState, useEffect } from "react";
import { EXPERIENCE } from "@/data/experience";
import { TimelineItem } from "@/components/experience/TimelineItem";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

// Snap onto an item's dot within SNAP_ENTER px of the viewport centre, and only let go
// beyond SNAP_EXIT px, so the dot doesn't flicker at the edge of the zone.
const SNAP_ENTER = 60;
const SNAP_EXIT = 90;
// Time constant of the glide towards the target, in ms. Frame-rate independent.
const GLIDE_TAU = 160;
// Shared by the timeline line and the moving seam. Opaque, so the line doesn't show through the seam.
const LINE_COLOUR = "color-mix(in srgb, var(--color-dark) 20%, var(--color-page-light))";

// Each item renders a mobile and a desktop dot; only the one in the current layout has a box.
const visibleDot = (row: HTMLElement | null) =>
    row ? Array.from(row.querySelectorAll<HTMLElement>("[data-timeline-dot]")).find(d => d.getClientRects().length > 0) : undefined;

export function Experience() {
    const timelineRef = useRef<HTMLDivElement>(null);
    const fixedDotRef = useRef<SVGSVGElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [snappedIndex, setSnappedIndex] = useState<number | null>(null);
    const [revealedItems, setRevealedItems] = useState<boolean[]>(() => EXPERIENCE.map(() => false));

    useEffect(() => {
        let snapped: number | null = null;
        let targetY = 0;
        let animY = 0;
        let visible = false;
        let rafId = 0;
        let lastFrame = 0;

        // The moving dot is positioned directly in the DOM, so gliding never re-renders React
        const draw = () => {
            const svg = fixedDotRef.current;
            if (!svg) return;
            svg.style.top = `${animY}px`;
            svg.style.transform = `translate(-50%, -50%) scale(${visible ? 1 : 0})`;
        };

        const animate = (now: number) => {
            const dt = lastFrame ? now - lastFrame : 16;
            lastFrame = now;
            const diff = targetY - animY;
            if (Math.abs(diff) > 0.1) {
                animY += diff * (1 - Math.exp(-dt / GLIDE_TAU));
                draw();
                rafId = requestAnimationFrame(animate);
            } else {
                animY = targetY;
                draw();
                rafId = 0;
            }
        };

        const startGlide = () => {
            if (rafId) return;
            lastFrame = 0;
            rafId = requestAnimationFrame(animate);
        };

        const update = () => {
            const centre = window.innerHeight / 2;
            const dots = itemRefs.current.map(visibleDot);

            let newSnapped: number | null = null;
            let newTargetY = centre;
            for (let i = 0; i < dots.length; i++) {
                const el = dots[i];
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                const dotCentreY = rect.top + rect.height / 2;
                const threshold = snapped === i ? SNAP_EXIT : SNAP_ENTER;
                if (Math.abs(dotCentreY - centre) < threshold) {
                    newTargetY = dotCentreY;
                    newSnapped = i;
                    break;
                }
            }

            const timeline = timelineRef.current;
            const svg = fixedDotRef.current;
            const tracking = !!timeline && !!svg && svg.getClientRects().length > 0;
            if (tracking) {
                const { top, bottom } = timeline.getBoundingClientRect();
                const nowVisible = top < window.innerHeight && bottom > 0;
                const clamped = Math.max(top, Math.min(bottom, newTargetY));
                // Jump rather than glide when riding the ends of the line, when the dot first
                // appears, or when it's off-screen (e.g. after a nav jump), so it never flies in.
                if (clamped !== newTargetY || (nowVisible && !visible) || animY < 0 || animY > window.innerHeight) {
                    animY = clamped;
                } else if (newSnapped !== null && newSnapped === snapped && Math.abs(animY - clamped) < 2) {
                    // Already caught up with a snapped dot — follow it exactly while scrolling
                    animY = clamped;
                }
                visible = nowVisible;
                targetY = clamped;
                draw();
                startGlide();
            }

            snapped = newSnapped;
            setSnappedIndex(newSnapped);

            setRevealedItems(prev => {
                const next = dots.map((el, i) => prev[i] || (!!el && el.getBoundingClientRect().top <= centre));
                return next.every((r, i) => r === prev[i]) ? prev : next;
            });
        };

        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        update();
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    return (
        <>
            <svg
                ref={fixedDotRef}
                className="fixed z-50 pointer-events-none hidden md:block"
                width="9.8"
                height="23.8"
                viewBox="0 0 14 34"
                style={{ top: 0, left: "50%", transform: "translate(-50%, -50%) scale(0)" }}
            >
                {/* A seam opening in the line: needle-thin tips with concave flanks that swell at the middle */}
                <path
                    d="M 7 0
                       C 7.3 9, 13 11, 13 17
                       C 13 23, 7.3 25, 7 34
                       C 6.7 25, 1 23, 1 17
                       C 1 11, 6.7 9, 7 0 Z"
                    style={{ fill: LINE_COLOUR }}
                />
            </svg>
            <section className="bg-page-light px-5 pt-20 pb-20 md:px-10 md:pt-28 md:pb-28 rounded-3xl">
                <div className="max-w-[1100px] mx-auto">
                    <Reveal>
                        <SectionHeading label="Experience" onDark={false} className="mb-3">
                            Where I've Worked
                        </SectionHeading>
                        <p className="text-base text-on-light-dim mb-16">
                            From early-stage agencies to product companies, shipping software that matters.
                        </p>
                    </Reveal>
                    <div ref={timelineRef} className="relative">
                        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 border" style={{ borderColor: LINE_COLOUR }} />
                        <div className="flex flex-col">
                            {EXPERIENCE.map((item, i) => (
                                <TimelineItem
                                    key={i}
                                    item={item}
                                    index={i}
                                    last={i === EXPERIENCE.length - 1}
                                    revealed={revealedItems[i]}
                                    snapped={snappedIndex === i}
                                    itemRef={(el) => { itemRefs.current[i] = el; }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
