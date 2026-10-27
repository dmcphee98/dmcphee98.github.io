import { useScrollY } from "@/hooks/useScrollY";
import { scrollToContact } from "@/lib/utils";

export function Nav() {
    const scrollY = useScrollY();
    // Hero is h-screen, so its halfway point is half the viewport height
    const navSolid = scrollY > window.innerHeight * 0.5;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[200] px-5 md:px-10 h-14 md:h-14.5 flex items-center justify-between transition-all duration-400 ${navSolid ? "bg-dark/95 backdrop-blur-md" : "bg-transparent"}`}>
            {/* Over the hero, the name sits on light sky on mobile and on the dark gradient on desktop */}
            <span className={`text-base font-extrabold tracking-[-0.01em] transition-colors duration-400 ${navSolid ? "text-content" : "text-dark md:text-content"}`}>
                Dean McPhee
            </span>
            <div className="flex items-center gap-[1.8rem]">
                <button
                    onClick={scrollToContact}
                    // Over the hero, the button sits on light sky on both mobile and desktop
                    className={`${navSolid ? "bg-surface text-content border-on-light" : "bg-on-light/10 border-on-light/30 text-on-light"} border rounded-md px-4.5 py-1.75 text-sm font-bold cursor-pointer font-[inherit] tracking-[0.02em] transition-all duration-[400ms]`}
                >
                    Get in touch
                </button>
            </div>
        </nav>
    );
}
