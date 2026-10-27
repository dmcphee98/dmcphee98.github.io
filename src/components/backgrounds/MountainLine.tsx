import { useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { generateMountainRange, type MountainRange } from "@/lib/mountainRange";

const RIDGE_DURATION = 2.4;
const STROKE_DURATION = 0.9;
const STROKES_START = 1.2;
const STROKE_STAGGER = 0.08;
const PINE_DURATION = 0.9;
const PINE_STAGGER = 0.3;

// Each path with its draw-in timing: the ridge, then the detail lines staggered left to right, then — once the
// last detail line has finished — each pine, its two halves together so it grows from the ground up
function timedPaths({ ridge, strokes, pines }: MountainRange) {
    const pinesStart = STROKES_START + strokes.length * STROKE_STAGGER + STROKE_DURATION;
    return [
        { d: ridge, delay: 0, duration: RIDGE_DURATION },
        ...strokes.map((d, i) => ({ d, delay: STROKES_START + (i + 1) * STROKE_STAGGER, duration: STROKE_DURATION })),
        ...pines.flatMap((halves, i) => halves.map(d => ({ d, delay: pinesStart + i * PINE_STAGGER, duration: PINE_DURATION }))),
    ];
}

export function MountainLine({ className = "" }: { className?: string }) {
    const { ref, visible } = useReveal(0.3);
    // id changes with each redraw so the svg remounts and the draw-in animation replays
    const [range, setRange] = useState(() => ({ id: 0, paths: timedPaths(generateMountainRange()) }));

    const redraw = () => setRange(r => ({ id: r.id + 1, paths: timedPaths(generateMountainRange()) }));

    return (
        // On narrow screens the art keeps a minimum width and is cropped to its centre, so the peaks don't shrink to nothing
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            role="button"
            tabIndex={0}
            aria-label="Draw a new mountain range"
            title="Click for a new range"
            onClick={redraw}
            onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    redraw();
                }
            }}
            className={`overflow-hidden cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-on-light/40 ${className}`}
        >
            <svg key={range.id} viewBox="0 0 1200 160" className="relative left-1/2 -translate-x-1/2 w-full min-w-[640px] h-auto" fill="none">
                {range.paths.map(({ d, delay, duration }, i) => (
                    <path
                        key={i}
                        d={d}
                        // pathLength=1 lets one dash cover any path, so dashoffset 1→0 draws it in
                        pathLength={1}
                        stroke="currentColor"
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        strokeDasharray="1"
                        style={visible
                            ? { animation: `mountain-draw ${duration}s ease-out ${delay}s both` }
                            : { strokeDashoffset: 1 }}
                        className="motion-reduce:[animation:none]"
                    />
                ))}
            </svg>
        </div>
    );
}
