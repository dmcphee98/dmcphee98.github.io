import { Logomark } from "@/components/ui/Logomark";

export function Footer() {
    return (
        // Sits over the grass at the bottom of the contact photo
        <footer className="bg-[linear-gradient(to_top,rgba(8,13,20,0.6),rgba(8,13,20,0))] px-10 pt-10 pb-6 grid grid-cols-[1fr_auto_1fr] items-center">
            <span className="text-xs text-white/75">© {new Date().getFullYear()}</span>
            <Logomark className="h-7 w-auto text-white/75" />
        </footer>
    );
}
