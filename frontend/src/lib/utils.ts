import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
