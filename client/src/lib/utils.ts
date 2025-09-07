import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const scrollToSection = (sectionId: string) => {
  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
};



