import { useReveal } from "@/hooks/useReveal";

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    const { ref, visible } = useReveal();
    return (
        <div
            ref={ref as React.RefObject<HTMLDivElement>}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-[opacity,transform] duration-650 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-9"} ${className}`}
        >
            {children}
        </div>
    );
}
