import { SiGithub } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";
import { FaEnvelope, FaFilePdf } from "react-icons/fa6";

export const EMAIL = "deanjamesmcphee@gmail.com";
export const EMAIL_HREF = `mailto:${EMAIL}`;
export const LINKEDIN_URL = "https://www.linkedin.com/in/dean-mcphee/";
export const GITHUB_URL = "https://github.com/dmcphee98";
export const CV_PATH = "/DeanMcPheeCV.pdf";

export interface ContactLink {
    icon: React.ReactNode;
    href: string;
    label: string;
    cls: string;
    download?: string;
}

export const CONTACT_LINKS: ContactLink[] = [
    { icon: <FaEnvelope size={28} />, href: EMAIL_HREF, label: "Email", cls: "bg-accent text-dark hover:bg-accent-bold" },
    { icon: <FaLinkedinIn size={28} />, href: LINKEDIN_URL, label: "LinkedIn", cls: "bg-muted text-white hover:bg-[#4A8CAD]" },
    { icon: <SiGithub size={30} />, href: GITHUB_URL, label: "GitHub", cls: "bg-elevated text-content hover:bg-surface" },
    { icon: <FaFilePdf size={32} className="translate-x-0.5" />, href: CV_PATH, download: "DeanMcPheeCV.pdf", label: "Download CV", cls: "bg-surface-dark md:bg-surface text-accent hover:bg-elevated" },
];
