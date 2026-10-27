import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export default function Portfolio() {
    return (
        <div className="font-sans text-content bg-surface-dark">
            <ScrollToTopButton />
            <Nav />

            {/* Wrapping the top hero with the sheet ends its stickiness where the sheet ends,
                so it scrolls away before the contact hero underneath starts to show */}
            <div className="relative">
                <Hero />

                {/* Content sheet scrolls up over the top hero, then off the contact hero */}
                <div className="relative z-10 rounded-b-3xl shadow-[0_-16px_60px_rgba(8,13,20,0.5),0_16px_60px_rgba(8,13,20,0.5)] overflow-hidden">
                    <About />
                    <Projects />
                    <Experience />
                    <Skills />
                </div>
            </div>

            <Contact />
        </div>
    );
}
