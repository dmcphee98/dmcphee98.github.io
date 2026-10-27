import type { ComponentType } from "react";

export type SkillItem = { name: string; Icon: ComponentType<{ size?: number | string }>; color: string };

export type FeaturedSkill = SkillItem & { desc: string };
