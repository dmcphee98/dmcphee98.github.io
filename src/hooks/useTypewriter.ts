import { useState, useEffect } from "react";

export function useTypewriter(
    words: string[],
    typeSpeed = 60,
    deleteSpeed = 30,
    pauseTyped = 1500,
    pauseDeleted = 500,
) {
    const [text, setText] = useState("");
    const [wordIdx, setWordIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const word = words[wordIdx];
        if (!deleting) {
            if (text.length < word.length) {
                const id = setTimeout(() => setText(word.slice(0, text.length + 1)), typeSpeed);
                return () => clearTimeout(id);
            }
            const id = setTimeout(() => setDeleting(true), pauseTyped);
            return () => clearTimeout(id);
        } else {
            if (text.length > 0) {
                const id = setTimeout(() => setText(prev => prev.slice(0, -1)), deleteSpeed);
                return () => clearTimeout(id);
            }
            const id = setTimeout(() => {
                setDeleting(false);
                setWordIdx(i => (i + 1) % words.length);
            }, pauseDeleted);
            return () => clearTimeout(id);
        }
    }, [text, deleting, wordIdx]);

    return text;
}

// Types `word` in once, starting when `start` first becomes true, then leaves it in place.
// Users who prefer reduced motion get the full word straight away.
export function useTypeIn(word: string, start: boolean, typeSpeed = 60) {
    const [text, setText] = useState("");
    const [started, setStarted] = useState(false);
    const [reducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // Latch on the first time `start` is true, so scrolling back up doesn't restart it
    if (start && !started) setStarted(true);

    useEffect(() => {
        if (!started || reducedMotion || text.length >= word.length) return;
        const id = setTimeout(() => setText(word.slice(0, text.length + 1)), typeSpeed);
        return () => clearTimeout(id);
    }, [started, reducedMotion, text, word, typeSpeed]);

    return started && reducedMotion ? word : text;
}
