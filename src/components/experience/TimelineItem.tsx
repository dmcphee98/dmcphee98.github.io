import { EXPERIENCE } from "@/data/experience";

export function TimelineItem({ item, index, last, revealed, snapped, itemRef }: {
    item: typeof EXPERIENCE[0];
    index: number;
    last: boolean;
    revealed: boolean;
    snapped: boolean;
    itemRef: (el: HTMLDivElement | null) => void;
}) {
    const isLeft = index % 2 === 0;

    const cardShadow = "0 4px 24px color-mix(in srgb, var(--color-dark) 9%, transparent)";

    // Drawn as SVG rather than a rounded CSS box: Chrome scales a rounded box's corners as
    // separate pieces, and mid-animation hairline gaps between them showed as a white cross.
    // The 16px box keeps the layout; the 48px drawing overflows it to leave room for the glow.
    const fade = (on: boolean) => ({ opacity: on ? 1 : 0, transition: "opacity 350ms ease" });
    // Rendered in both the mobile and desktop layouts; each copy needs its own gradient id,
    // since a gradient inside the hidden layout can't be used by the visible one.
    const dot = (layout: "mobile" | "desktop") => (
        <div className="relative w-4 h-4">
            <svg
                viewBox="-24 -24 48 48"
                className="absolute -inset-4 w-12 h-12 overflow-visible"
                style={{
                    opacity: revealed ? 1 : 0,
                    transform: revealed ? `scale(${snapped ? 2.0 : 1})` : "scale(0)",
                    transition: "opacity 350ms ease, transform 350ms ease",
                }}
            >
                <defs>
                    <radialGradient id={`timeline-glow-${layout}-${index}`}>
                        <stop offset="0.33" stopColor="var(--color-accent)" stopOpacity="0.45" />
                        <stop offset="0.55" stopColor="var(--color-accent)" stopOpacity="0.18" />
                        <stop offset="1" stopColor="var(--color-accent)" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <circle r="24" fill={`url(#timeline-glow-${layout}-${index})`} style={fade(snapped)} />
                <circle r="11" style={{ fill: "var(--color-accent)", fillOpacity: 0.18, ...fade(!snapped) }} />
                <circle r="13" style={{ fill: "var(--color-accent)", fillOpacity: 0.25, ...fade(snapped) }} />
                <circle r="8" style={{ fill: "var(--color-page-light)" }} />
                <circle r="5" style={{ fill: "var(--color-accent)" }} />
            </svg>
        </div>
    );

    const cardInner = (
        <>
            <p className="text-xs font-bold text-accent tracking-[0.06em] m-0 mb-2">{item.years}</p>
            <h3 className="text-lg font-extrabold text-dark mt-0 mb-1">{item.role}</h3>
            <p className="text-sm font-semibold text-on-light-dim mb-3">{item.company}</p>
            <div className="text-sm text-on-light">
                {item.desc.map((line, i) => (
                    <p key={i} className="leading-relaxed mb-2">{line}{i < item.desc.length - 1 && <br />}</p>
                ))}
            </div>
        </>
    );

    return (
        <div ref={itemRef}>
            {/* Mobile: dot + line left, card right */}
            <div className="md:hidden flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                    <div data-timeline-dot className="mt-1">{dot("mobile")}</div>
                    {!last && <div className="w-px flex-1 bg-dark/[0.12] mt-2" />}
                </div>
                <div className="flex-1 pb-8">
                    <div
                        style={{
                            opacity: revealed ? 1 : 0,
                            transform: revealed ? (snapped ? "translateY(0.35rem)" : "translateY(0)") : "translateY(1.5rem)",
                            boxShadow: cardShadow,
                            transition: "opacity 550ms ease 80ms, transform 550ms ease 80ms, box-shadow 350ms ease",
                        }}
                        className="bg-white rounded-[14px] p-6"
                    >
                        {cardInner}
                    </div>
                </div>
            </div>

            {/* Desktop: alternating left / right around center dot */}
            <div className={`hidden md:grid grid-cols-[1fr_3rem_1fr] items-center py-6${index > 0 ? " -mt-24" : ""}`}>
                <div className="pr-10">
                    {isLeft && (
                        <div
                            style={{
                                opacity: revealed ? 1 : 0,
                                transform: revealed ? (snapped ? "translateX(-0.6rem)" : "translateX(0)") : "translateX(-2rem)",
                                boxShadow: cardShadow,
                                transition: "opacity 550ms ease 80ms, transform 550ms ease 80ms, box-shadow 350ms ease",
                            }}
                            className="bg-white rounded-[14px] p-8"
                        >
                            {cardInner}
                        </div>
                    )}
                </div>
                <div data-timeline-dot className="flex justify-center relative z-60">{dot("desktop")}</div>
                <div className="pl-10">
                    {!isLeft && (
                        <div
                            style={{
                                opacity: revealed ? 1 : 0,
                                transform: revealed ? (snapped ? "translateX(0.6rem)" : "translateX(0)") : "translateX(2rem)",
                                boxShadow: cardShadow,
                                transition: "opacity 550ms ease 80ms, transform 550ms ease 80ms, box-shadow 350ms ease",
                            }}
                            className="bg-white rounded-[14px] p-8"
                        >
                            {cardInner}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
