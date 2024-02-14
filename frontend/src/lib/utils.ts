import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SfarimQuery } from "./types";
import { delimiter } from "./consts";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatQueryParams = (searchParams: {
  [key: string]: string | string[] | undefined;
}): SfarimQuery => {
  const q: SfarimQuery = {};

  if (searchParams.query && typeof searchParams.query === "string")
    q.query = searchParams.query;
  if (searchParams.categories && typeof searchParams.categories === "string")
    q.categories = searchParams.categories.split(delimiter);
  if (searchParams.language && typeof searchParams.language === "string")
    q.languages = searchParams.language.split(delimiter);
  if (searchParams.page) q.page = Number(searchParams.page);
  if (searchParams.perPage) q.perPage = Number(searchParams.perPage);

  return q;
};
