import { useEffect, useRef } from "react";

// Plays the CSS animations inside an element while it's hovered (on devices that can hover). On leave, each animation keeps
// running until it reaches its next rest frame, then pauses there, so the icon always ends up
// looking complete.
//
// The animations start paused (see index.css), so their rest frame is currentTime 0. By default
// an animation is at rest at the start of every loop; `--rest-every` on the animated element
// overrides that with a shorter interval, and `0s` means it can stop on any frame.
export function useHoverAnimations<T extends HTMLElement>() {
    const ref = useRef<T>(null);
    const timers = useRef<number[]>([]);

    const clearTimers = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    };

    useEffect(() => clearTimers, []);

    // Only keyframe animations: the card's own hover transitions must be left alone. On devices
    // that can't hover (phones, tablets), taps still fire mouse events, so skip them there:
    // the CSS keeps those animations always playing instead.
    const animations = () => {
        if (!window.matchMedia("(hover: hover)").matches) return [];
        return ref.current?.getAnimations({ subtree: true }).filter(a => a instanceof CSSAnimation) ?? [];
    };

    const onMouseEnter = () => {
        clearTimers();
        animations().forEach(a => a.play());
    };

    const onMouseLeave = () => {
        animations().forEach(a => {
            const t = Number(a.currentTime ?? 0);
            const interval = restInterval(a);
            const next = interval > 0 ? Math.ceil(t / interval) * interval : t;
            const stop = () => {
                a.pause();
                a.currentTime = next;
            };
            if (next - t < 1) stop();
            else timers.current.push(window.setTimeout(stop, next - t));
        });
    };

    return { ref, onMouseEnter, onMouseLeave };
}

function restInterval(a: Animation) {
    const target = (a.effect as KeyframeEffect | null)?.target;
    const override = target && getComputedStyle(target).getPropertyValue("--rest-every").trim();
    if (override) return parseFloat(override) * 1000;
    return Number(a.effect?.getComputedTiming().duration ?? 0);
}
