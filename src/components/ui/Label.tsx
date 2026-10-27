export function Label({ children, onDark = true }: { children: React.ReactNode; onDark?: boolean }) {
    return (
        <p className={`text-xs font-bold tracking-[0.16em] uppercase mb-4 ${onDark ? "text-accent-bold" : "text-accent"}`}>
            {children}
        </p>
    );
}
