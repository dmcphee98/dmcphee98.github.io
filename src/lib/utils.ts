import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

// The contact hero is pinned to the bottom of the viewport, so scrollIntoView sees it as already
// in view; it's only fully uncovered at the very end of the page
export function scrollToContact() {
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
}
