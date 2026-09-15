import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatRelationLabel(value: string) {
  return {
    advised_by: "师承",
    influenced_by: "影响",
    coauthored_with: "合作"
  }[value] ?? value;
}

export function shortNumber(value: number) {
  return new Intl.NumberFormat("zh-CN", { notation: "compact" }).format(value);
}
