import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SfarimQuery } from "./types";
import { delimiter } from "./consts";

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats the query parameters and returns a SfarimQuery object.
 *
 * @param {{ [key: string]: string | string[] | undefined; }} searchParams - The search parameters to be formatted.
 * @return {SfarimQuery} The formatted SfarimQuery object.
 */
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

/**
 * Trims all the string values in the given object, including nested objects.
 *
 * @param {Record<string, any>} obj - The object to trim
 * @return {Record<string, any>} The object with trimmed string values
 */
export const trimStrings = (obj: Record<string, any>) => {
  for (let prop in obj) {
    if (typeof obj[prop] === "string") {
      obj[prop] = obj[prop].trim();
    } else if (typeof obj[prop] === "object") {
      obj[prop] = trimStrings(obj[prop]); // Recursive call for nested objects
    }
  }
  return obj;
};

/**
 * Check if the given id exists in the list of users who have bookmarked a book
 *
 * @param {Record<string, any>[]} users - The list of users
 * @param {number} id - The id to check for existence in the list of users
 * @return {boolean} Whether the id exists in the list of users
 */
export const isBookmarked = (
  users: Record<string, any>[],
  id: number | undefined,
) => {
  if (!users || !id) return false;
  return users.some((user) => user.ID == id);
};
