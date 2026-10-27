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

    const dot = (
        <div
            style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? `scale(${snapped ? 2.0 : 1})` : "scale(0)",
                transition: "opacity 350ms ease, transform 350ms ease",
                boxShadow: snapped
                    ? "0 0 0 5px color-mix(in srgb, var(--color-accent) 25%, transparent), 0 0 16px color-mix(in srgb, var(--color-accent) 45%, transparent)"
                    : "0 0 0 3px color-mix(in srgb, var(--color-accent) 18%, transparent)",
            }}
            className="w-4 h-4 rounded-full bg-accent border-[3px] border-page-light"
        />
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
        <div>
            {/* Mobile: dot + line left, card right */}
            <div className="md:hidden flex gap-4">
                <div className="flex flex-col items-center shrink-0">
                    <div className="mt-1">{dot}</div>
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
                <div ref={itemRef} className="flex justify-center relative z-60">{dot}</div>
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
