import { useEffect, useState } from "react";

export function ScrollToTopButton() {
    const [visible, setVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        const update = () => {
            const sy = window.scrollY;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            setProgress(maxScroll > 0 ? sy / maxScroll : 0);
            setVisible(sy > window.innerHeight * 0.8);
        };
        window.addEventListener("scroll", update, { passive: true });
        update();
        return () => window.removeEventListener("scroll", update);
    }, []);

    const size = 60;
    const stroke = 3.5;
    const r = size / 2 - stroke - 4;
    const circ = 2 * Math.PI * r;

    const scale = !visible ? 0.8 : hovered ? 1.05 : 1;
    const translateY = !visible ? 10 : 0;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label="Scroll to top"
            style={{
                position: "fixed",
                bottom: "1.75rem",
                right: "1.75rem",
                width: size,
                height: size,
                opacity: visible ? 1 : 0,
                transform: `scale(${scale}) translateY(${translateY}px)`,
                pointerEvents: visible ? "auto" : "none",
                transition: "opacity 300ms ease, transform 300ms ease, box-shadow 300ms ease",
                zIndex: 150,
                background: hovered
                    ? "var(--color-accent-bold)"
                    : "var(--color-accent)",
            }}
            className="rounded-full flex items-center justify-center cursor-pointer border-0 p-0"
        >
            {/* Progress ring */}
            <svg
                width={size}
                height={size}
                style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke="rgba(8,13,20,0.15)"
                    strokeWidth={stroke}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    fill="none"
                    stroke="rgba(8,13,20,0.55)"
                    strokeWidth={stroke}
                    strokeDasharray={circ}
                    strokeDashoffset={circ * (1 - progress)}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 80ms linear" }}
                />
            </svg>
            {/* Up arrow */}
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" style={{ position: "relative" }}>
                <path
                    d="M8 13V3M8 3L3 8M8 3L13 8"
                    stroke="#080D14"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}
