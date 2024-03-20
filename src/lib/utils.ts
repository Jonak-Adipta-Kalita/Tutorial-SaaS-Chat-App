import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const prettyUUID = (uuid: string, n = 4) => {
  return uuid.substring(0, n);
};
