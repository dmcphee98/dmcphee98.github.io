import { useEffect, useRef, useState } from "react";
import { FiCheck, FiCopy, FiMail } from "react-icons/fi";
import { useScrollY } from "@/hooks/useScrollY";
import { useTypeIn } from "@/hooks/useTypewriter";
import { Footer } from "@/components/sections/Footer";
import { EMAIL, EMAIL_HREF } from "@/data/contact";

// A second hero at the bottom of the page. It's pinned to the bottom of the viewport behind the content
// sheet, so the sheet slides up off it, mirroring the top hero.
export function Contact() {
    const scrollY = useScrollY();
    // How far the sheet still covers this section: one viewport height when it starts to show, 0 at the very bottom
    const covered = Math.max(0, Math.min(window.innerHeight, document.documentElement.scrollHeight - scrollY - window.innerHeight));
    const reveal = 1 - covered / window.innerHeight;
    // The photo starts lower and rises more slowly than the sheet, matching the top hero's 0.36 parallax
    const parallax = covered * 0.36;

    // Types the address in the first time the section is mostly in view. `reveal` is meaningless on the
    // first render (the page has no height yet, so it reads as fully revealed), so wait a frame for layout
    const [laidOut, setLaidOut] = useState(false);
    useEffect(() => {
        const id = requestAnimationFrame(() => setLaidOut(true));
        return () => cancelAnimationFrame(id);
    }, []);
    const typedEmail = useTypeIn(EMAIL, laidOut && reveal > 0.7);
    const [emailUser, emailDomain] = typedEmail.split("@");
    const emailRef = useRef<HTMLSpanElement>(null);
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(t);
    }, [copied]);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
        } catch {
            // Clipboard blocked or unavailable — select the address so it can be copied by hand
            if (!emailRef.current) return;
            const range = document.createRange();
            range.selectNodeContents(emailRef.current);
            window.getSelection()?.removeAllRanges();
            window.getSelection()?.addRange(range);
        }
    };

    return (
        <section id="contact" className="sticky bottom-0 z-0 h-screen overflow-hidden">
            <img
                src="/contact.webp" alt=""
                style={{ transform: `translateY(${parallax}px)` }}
                className="absolute inset-0 w-full h-full object-cover object-[center_40%] will-change-transform"
            />
            {/* Lifts the sky behind the text, and darkens the whole photo while the sheet is still sliding off */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(230,234,240,0.7)_0%,rgba(230,234,240,0.35)_30%,rgba(230,234,240,0)_50%)]" />
            <div style={{ background: `rgba(8,13,20,${(1 - reveal) * 0.5})` }} className="absolute inset-0" />

            <div
                style={{ opacity: Math.min(1, reveal * 1.5), transform: `translateY(${(1 - reveal) * 48}px)` }}
                className="relative pt-24 md:pt-[14vh] px-5 text-center"
            >
                <p className="text-xs font-extrabold tracking-[0.14em] uppercase text-accent mb-3">
                    Get in touch
                </p>
                <h2
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3.375rem)" }}
                    className="font-black text-dark m-0 mb-3 tracking-[-0.02em] leading-[1.1] text-balance"
                >
                    Let's build something together.
                </h2>
                <p className="text-base text-on-light mb-7">
                    Open to roles, projects, and new connections.
                </p>
                {/* Search-box style field: open-in-mail on the left, the address, copy on the right.
                    Liquid glass: a light frosted tint that blurs and saturates the photo behind it, a bright
                    rim, and a sheen across the top half that catches the light */}
                <div className="relative isolate inline-flex items-center gap-1 max-w-full rounded-2xl p-1.5 bg-white/35 backdrop-blur-xl backdrop-saturate-[1.8] border border-white/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(255,255,255,0.3),inset_0_0_16px_rgba(255,255,255,0.35),0_8px_32px_rgba(8,13,20,0.18)]">
                    <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 -z-10 rounded-t-2xl bg-[linear-gradient(to_bottom,rgba(255,255,255,0.55),rgba(255,255,255,0))]" />
                    <a
                        href={EMAIL_HREF}
                        aria-label="Open in mail app"
                        title="Open in mail app"
                        className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white/50 text-dark hover:bg-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition-colors duration-200"
                    >
                        <FiMail size={18} />
                    </a>
                    {/* The full address sits invisibly in the same grid cell as the typed one, so the field is
                        its final size from the start and doesn't grow as the address types in */}
                    <span
                        style={{ fontSize: "clamp(0.8125rem, 0.55rem + 1.4vw, 1.25rem)" }}
                        className="grid min-w-0 px-2 sm:px-3 text-left font-bold text-dark tracking-[-0.01em]"
                    >
                        <span aria-hidden className="invisible col-start-1 row-start-1">
                            {/* If it has to wrap, wrap after the @ rather than mid-word */}
                            {EMAIL.split("@")[0]}@<wbr />{EMAIL.split("@")[1]}
                            <span className="font-extralight ml-px">|</span>
                        </span>
                        <span aria-hidden className="col-start-1 row-start-1">
                            <span ref={emailRef}>
                                {emailUser}{emailDomain !== undefined && <>@<wbr />{emailDomain}</>}
                            </span>
                            <span className="animate-blink-fade font-extralight ml-px">|</span>
                        </span>
                        <span className="sr-only">{EMAIL}</span>
                    </span>
                    <button
                        onClick={copyEmail}
                        aria-label="Copy email address"
                        title={copied ? "Copied!" : "Copy email"}
                        className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-dark text-content hover:bg-surface border-0 cursor-pointer transition-colors duration-200"
                    >
                        {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
                    </button>
                </div>
                <span aria-live="polite" className="sr-only">{copied ? "Email address copied" : ""}</span>
            </div>

            <div className="absolute bottom-0 inset-x-0">
                <Footer />
            </div>
        </section>
    );
}
