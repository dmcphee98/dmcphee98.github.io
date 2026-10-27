import { Label } from "@/components/ui/Label";

export function SectionHeading({ label, children, onDark = true, className = "" }: {
    label: string;
    children: React.ReactNode;
    onDark?: boolean;
    className?: string;
}) {
    return (
        <>
            <Label onDark={onDark}>{label}</Label>
            <h2
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.375rem)" }}
                className={`font-black m-0 tracking-[-0.02em] ${onDark ? "text-content" : "text-dark"} ${className}`}
            >
                {children}
            </h2>
        </>
    );
}
