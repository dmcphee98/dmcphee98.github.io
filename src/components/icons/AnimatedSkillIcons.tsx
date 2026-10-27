// Logos for the featured skill cards, split into separate parts so each
// part can be animated. The keyframes and reduced-motion fallback live in index.css.
import { useId } from "react";
import type { CSSProperties, SVGProps } from "react";

type IconProps = { size?: number | string } & SVGProps<SVGSVGElement>;

// pathLength=1 lets one dash cover any path, so dashoffset 1→0 draws it in
const drawable = { pathLength: 1, strokeDasharray: "1" };
const delay = (s: number) => ({ animationDelay: `${s}s` }) as CSSProperties;
// The animations sit paused until their card is hovered (see index.css). A negative delay starts each
// loop part-way through, on a frame where the logo is fully drawn, so it looks complete at rest and
// carries straight on from there on hover.

function Frame({ size = "1em", children, ...props }: IconProps) {
    return (
        <svg
            viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"
            fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
            {...props}
        >
            {children}
        </svg>
    );
}

// The real Java logo (Font Awesome's FaJava), with the cup lines kept and the steam redrawn as waves
const JAVA_CUP = "M277.74 312.9c9.8-6.7 23.4-12.5 23.4-12.5s-38.7 7-77.2 10.2c-47.1 3.9-97.7 4.7-123.1 1.3-60.1-8 33-30.1 33-30.1s-36.1-2.4-80.6 19c-52.5 25.4 130 37 224.5 12.1zM300.84 375.1a12.19 12.19 0 0 1-2 2.6c128.3-33.7 81.1-118.9 19.8-97.3a17.33 17.33 0 0 0-8.2 6.3 70.45 70.45 0 0 1 11-3c31-6.5 75.5 41.5-20.6 91.4zM348 437.4s14.5 11.9-15.9 21.2c-57.9 17.5-240.8 22.8-291.6 .7-18.3-7.9 16-19 26.8-21.3 11.2-2.4 17.7-2 17.7-2-20.3-14.3-131.3 28.1-56.4 40.2C232.84 509.4 401 461.3 348 437.4zM124.44 396c-78.7 22 47.9 67.4 148.1 24.5a185.89 185.89 0 0 1-28.2-13.8c-44.7 8.5-65.4 9.1-106 4.5-33.5-3.8-13.9-15.2-13.9-15.2zM304.24 493.2c-78.7 14.8-175.8 13.1-233.3 3.6 0-.1 11.8 9.7 72.4 13.6 92.2 5.9 233.8-3.3 237.1-46.9 0 0-6.4 16.5-76.2 29.7zM260.64 353c-59.2 11.4-93.5 11.1-136.8 6.6-33.5-3.5-11.6-19.7-11.6-19.7-86.8 28.8 48.2 61.4 169.5 25.9a60.37 60.37 0 0 1-21.1-12.8z";
// Java brand colours: blue cup, red steam
const JAVA_BLUE = "#5382A1"; // the classic Java blue; the newer #0074BD is too dark on the dark cards
const JAVA_RED = "#EA2D2E";
// Two wisps, each an endlessly repeating wave. Scrolling a wave up by exactly one period loops seamlessly,
// so at any fixed height the wisp appears to snake left and right. Both share one period, start point and
// loop length (.icon-steam in index.css), so they always sway in phase.
const JAVA_HEIGHT = 560;    // viewBox height: the logo plus 48 units below it, so the cup doesn't sit low in the frame
const STEAM_TOP = -20;      // a little above the viewBox, so the wave never runs out at the top
const STEAM_BASE = 300;     // where every wave starts, tucked behind the cup's rim
// Rest frame: the wave scrolled up until it crosses its centre line at y≈265, where the wisps have just
// faded in, so at rest each wisp rises straight out of the cup instead of leaning to one side.
// That happens every half loop with the curl alternating; the rest frame is the one that curls left at the bottom.
const STEAM_REST_DELAY = -1.0;  // seconds: 35 of the 280 units per 1.6s loop, plus half a loop
// About one full S-bend over the left wisp's height, like the flames in the logo
const STEAM_PERIOD = 280;
// As in the logo, the right wisp starts and ends lower than the left. `top` and `bottom` are where each
// wisp has fully faded out and where it starts to fade in.
// The pair is centred on the cup body (x≈197, between the stripes' ends; the handle is ignored)
const JAVA_WISPS = [
    { x: 161, amplitude: 40, width: 26, top: 0, bottom: 285 },
    { x: 233, amplitude: 30, width: 20, top: 50, bottom: 305 },
];

// A vertical wave of alternating parabolic arcs (q, then t reflects the control point to the other side),
// long enough to cover the steam area at every point of its one-period scroll
function wavePath(x: number, amplitude: number) {
    const half = STEAM_PERIOD / 2;
    const arcs = Math.ceil((STEAM_BASE + STEAM_PERIOD - STEAM_TOP) / half);
    return `M${x} ${STEAM_BASE + STEAM_PERIOD}q${amplitude * 2} ${-half / 2} 0 ${-half}` + ` t0 ${-half}`.repeat(arcs - 1);
}

// Fades in just above `bottom`, then out towards `top`, as a CSS gradient over the whole icon
function wispFade(top: number, bottom: number) {
    const at = (y: number) => `${(y / JAVA_HEIGHT) * 100}%`;
    const span = bottom - top;
    return `linear-gradient(to bottom, transparent ${at(top)}, rgb(0 0 0 / 0.7) ${at(top + span * 0.45)}, black ${at(bottom - span * 0.12)}, transparent ${at(bottom)})`;
}

const fill: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
// The logo is tall and narrow, so it's drawn 20% larger than its box and allowed to spill over evenly
// on every side; otherwise it leaves a lot of empty space in a square slot.
const enlarged: CSSProperties = { position: "absolute", inset: "-10%", width: "120%", height: "120%" };

export function AnimatedJava({ size = "1em", ...props }: IconProps) {
    // Each wisp is its own HTML layer: the browser can then slide it on the GPU with a CSS mask,
    // instead of repainting an SVG mask every frame (which is slow and makes the slow scroll judder).
    return (
        <span aria-hidden="true" style={{ position: "relative", display: "inline-block", width: size, height: size }}>
            {JAVA_WISPS.map(({ x, amplitude, width, top, bottom }) => (
                <span key={x} style={{ ...enlarged, maskImage: wispFade(top, bottom), WebkitMaskImage: wispFade(top, bottom) }}>
                    <svg
                        viewBox={`0 0 384 ${JAVA_HEIGHT}`} overflow="visible" className="icon-steam" style={{ ...fill, ...delay(STEAM_REST_DELAY) }}
                    >
                        <path
                            d={wavePath(x, amplitude)}
                            fill="none" stroke={JAVA_RED} strokeWidth={width} strokeLinecap="round"
                        />
                    </svg>
                </span>
            ))}
            <svg viewBox={`0 0 384 ${JAVA_HEIGHT}`} style={enlarged} {...props}>
                <path d={JAVA_CUP} fill={JAVA_BLUE} />
            </svg>
        </span>
    );
}

export function AnimatedReact(props: IconProps) {
    return (
        <Frame strokeWidth={1.2} {...props}>
            <g className="icon-orbit-spin">
                {[0, 60, 120].map((deg, i) => (
                    <path
                        key={deg}
                        className="icon-orbit"
                        d="M1 12a11 4.2 0 1 0 22 0a11 4.2 0 1 0-22 0"
                        transform={`rotate(${deg} 12 12)`}
                        {...drawable}
                        style={delay(i * 0.35 - 2.4)} // rest on the hold: 42–60% of the 4s loop
                    />
                ))}
            </g>
            <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </Frame>
    );
}

// The real AWS logo (Font Awesome's FaAws), split into its letters, the tapered smile and the arrowhead
const AWS_LETTERS = "M180.41 203.01c-.72 22.65 10.6 32.68 10.88 39.05a8.164 8.164 0 0 1-4.1 6.27l-12.8 8.96a10.66 10.66 0 0 1-5.63 1.92c-.43-.02-8.19 1.83-20.48-25.61a78.608 78.608 0 0 1-62.61 29.45c-16.28 .89-60.4-9.24-58.13-56.21-1.59-38.28 34.06-62.06 70.93-60.05 7.1 .02 21.6 .37 46.99 6.27v-15.62c2.69-26.46-14.7-46.99-44.81-43.91-2.4 .01-19.4-.5-45.84 10.11-7.36 3.38-8.3 2.82-10.75 2.82-7.41 0-4.36-21.48-2.94-24.2 5.21-6.4 35.86-18.35 65.94-18.18a76.857 76.857 0 0 1 55.69 17.28 70.285 70.285 0 0 1 17.67 52.36l-.01 69.29zM93.99 235.4c32.43-.47 46.16-19.97 49.29-30.47 2.46-10.05 2.05-16.41 2.05-27.4-9.67-2.32-23.59-4.85-39.56-4.87-15.15-1.14-42.82 5.63-41.74 32.26-1.24 16.79 11.12 31.4 29.96 30.48zM264.91 258.45c-7.86 .72-11.52-4.86-12.68-10.37l-49.8-164.65c-.97-2.78-1.61-5.65-1.92-8.58a4.61 4.61 0 0 1 3.86-5.25c.24-.04-2.13 0 22.25 0 8.78-.88 11.64 6.03 12.55 10.37l35.72 140.83 33.16-140.83c.53-3.22 2.94-11.07 12.8-10.24h17.16c2.17-.18 11.11-.5 12.68 10.37l33.42 142.63L420.98 80.1c.48-2.18 2.72-11.37 12.68-10.37h19.72c.85-.13 6.15-.81 5.25 8.58-.43 1.85 3.41-10.66-52.75 169.9-1.15 5.51-4.82 11.09-12.68 10.37h-18.69c-10.94 1.15-12.51-9.66-12.68-10.75L328.67 110.7l-32.78 136.99c-.16 1.09-1.73 11.9-12.68 10.75h-18.3zM538.39 264.08c-5.88 .01-33.92-.3-57.36-12.29a12.802 12.802 0 0 1-7.81-11.91v-10.75c0-8.45 6.2-6.9 8.83-5.89 10.04 4.06 16.48 7.14 28.81 9.6 36.65 7.53 52.77-2.3 56.72-4.48 13.15-7.81 14.19-25.68 5.25-34.95-10.48-8.79-15.48-9.12-53.13-21-4.64-1.29-43.7-13.61-43.79-52.36-.61-28.24 25.05-56.18 69.52-55.95 12.67-.01 46.43 4.13 55.57 15.62 1.35 2.09 2.02 4.55 1.92 7.04v10.11c0 4.44-1.62 6.66-4.87 6.66-7.71-.86-21.39-11.17-49.16-10.75-6.89-.36-39.89 .91-38.41 24.97-.43 18.96 26.61 26.07 29.7 26.89 36.46 10.97 48.65 12.79 63.12 29.58 17.14 22.25 7.9 48.3 4.35 55.44-19.08 37.49-68.42 34.44-69.26 34.42z";
const AWS_SMILE = "M578.59 368.94c-70.03 51.72-171.69 79.25-258.49 79.25A469.127 469.127 0 0 1 2.83 327.46c-6.53-5.89-.77-13.96 7.17-9.47a637.37 637.37 0 0 0 316.88 84.12 630.22 630.22 0 0 0 241.59-49.55c11.78-5 21.77 7.8 10.12 16.38z";
const AWS_ARROWHEAD = "M607.78 335.65c-8.96-11.52-59.28-5.38-81.81-2.69-6.79 .77-7.94-5.12-1.79-9.47 40.07-28.17 105.88-20.1 113.44-10.63 7.55 9.47-2.05 75.41-39.56 106.91-5.76 4.87-11.27 2.3-8.71-4.1 8.44-21.25 27.39-68.49 18.43-80.02z";

export function AnimatedAws({ size = "1em", ...props }: IconProps) {
    const maskId = useId();
    return (
        <svg viewBox="0 0 640 512" width={size} height={size} aria-hidden="true" fill="currentColor" {...props}>
            {/* The smile is a filled, tapered shape, so it can't be stroke-drawn directly.
                Instead a thick stroke along its centreline draws in inside a mask and reveals it left to right. */}
            <mask id={maskId} maskUnits="userSpaceOnUse">
                <path
                    className="icon-smile"
                    style={delay(-2.1)} // rest on the hold: 60% of the 3.5s loop
                    d="M4 322C150 430 430 460 574 360"
                    fill="none" stroke="white" strokeWidth={64} strokeLinecap="round"
                    {...drawable}
                />
            </mask>
            <path d={AWS_LETTERS} />
            <path d={AWS_SMILE} mask={`url(#${maskId})`} />
            {/* The separate arrowhead pops in once the smile reaches it */}
            <path className="icon-arrowhead" d={AWS_ARROWHEAD} style={delay(-2.1)} />
        </svg>
    );
}
