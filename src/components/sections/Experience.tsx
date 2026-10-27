import { useRef, useState, useEffect } from "react";
import { EXPERIENCE } from "@/data/experience";
import { TimelineItem } from "@/components/experience/TimelineItem";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
    const timelineRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const snappedIndexRef = useRef<number | null>(null);
    const targetYRef = useRef(0);
    const animYRef = useRef(0);
    const timelineBoundsRef = useRef<{ top: number; bottom: number } | null>(null);
    const [fixedDotVisible, setFixedDotVisible] = useState(false);
    const [fixedDotY, setFixedDotY] = useState(0);
    const [snappedIndex, setSnappedIndex] = useState<number | null>(null);
    const [revealedItems, setRevealedItems] = useState<boolean[]>(() => EXPERIENCE.map(() => false));

    useEffect(() => {
        const SNAP_ENTER = 60;
        const SNAP_EXIT = 60;

        const vhTarget = () => window.innerHeight / 2;

        targetYRef.current = vhTarget();
        animYRef.current = vhTarget();

        const update = () => {
            const target = vhTarget();

            if (timelineRef.current) {
                const { top, height } = timelineRef.current.getBoundingClientRect();
                const bottom = top + height;
                timelineBoundsRef.current = { top, bottom };
                setFixedDotVisible(top < window.innerHeight && bottom > 0);
            }

            let newTargetY = target;
            let snapped: number | null = null;
            for (let i = 0; i < itemRefs.current.length; i++) {
                const el = itemRefs.current[i];
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                const dotCenterY = rect.top + rect.height / 2;
                const threshold = snappedIndexRef.current === i ? SNAP_EXIT : SNAP_ENTER;
                if (Math.abs(dotCenterY - target) < threshold) {
                    newTargetY = dotCenterY;
                    snapped = i;
                    break;
                }
            }

            if (timelineBoundsRef.current) {
                const { top, bottom } = timelineBoundsRef.current;
                const clamped = Math.max(top, Math.min(bottom, newTargetY));
                if (clamped !== newTargetY) {
                    animYRef.current = clamped;
                    setFixedDotY(clamped);
                }
                newTargetY = clamped;
            }

            const prevSnapped = snappedIndexRef.current;
            snappedIndexRef.current = snapped;
            targetYRef.current = newTargetY;
            setSnappedIndex(snapped);

            // Bypass lerp only once animY has caught up — prevents jump on snap-in
            if (snapped !== null && snapped === prevSnapped && Math.abs(animYRef.current - newTargetY) < 2) {
                animYRef.current = newTargetY;
                setFixedDotY(newTargetY);
            }

            setRevealedItems(prev =>
                itemRefs.current.map((el, i) => {
                    if (prev[i]) return true;
                    if (!el) return false;
                    const { top } = el.getBoundingClientRect();
                    return top <= target;
                })
            );
        };

        let rafId: number;
        const animate = () => {
            const diff = targetYRef.current - animYRef.current;
            if (Math.abs(diff) > 0.1) {
                const factor = 0.03;
                animYRef.current += diff * factor;
                setFixedDotY(animYRef.current);
            }
            rafId = requestAnimationFrame(animate);
        };
        rafId = requestAnimationFrame(animate);

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
                className="fixed z-50 pointer-events-none hidden md:block"
                width="18"
                height="18"
                viewBox="0 0 30 30"
                style={{
                    top: `${fixedDotY}px`,
                    left: "50%",
                    transform: `translate(-50%, -50%) scale(${fixedDotVisible ? 1 : 0})`,
                }}
            >
                <path
                    d="M 15 2
                       C 16 5, 23 8, 23 15
                       C 23 22, 16 25, 15 28
                       C 14 25, 7 22, 7 15
                       C 7 8, 14 5, 15 2 Z"
                    fill="rgba(200,200,200)"
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
                        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 border border-dark/8" />
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
