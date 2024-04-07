import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SfarimQuery, User } from "./types";
import { delimiter } from "./consts";
import { ReadonlyURLSearchParams } from "next/navigation";

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Capitalizes the first letter of every word in the input string.
 *
 * @param {string} input - the input string to capitalize
 * @return {string} the capitalized input string
 */
export const capitalizeEverything = (input: string): string => {
  return input.replace(/\b\w/g, (char) => char.toUpperCase());
};

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

/**
 * Sets the page parameter in the URL and returns the updated URL.
 *
 * @param {ReadonlyURLSearchParams} params - The original URL search parameters
 * @param {number} page - The page number to set
 * @param {string} path - The path to append the updated URL to (default is "/")
 * @return {string} The updated URL
 */
export const setUrlPage = (
  params: ReadonlyURLSearchParams,
  page: number,
  path = "/",
): string => {
  const p = new URLSearchParams(Array.from(params.entries()));
  if (page < 2) {
    p.delete("page");
  } else {
    p.set("page", page.toString());
  }
  return path + "?" + p.toString();
};

/**
 * Resizes the image URL to the specified size if it is a google profile pic..
 *
 * @param {number} size - the desired size of the image
 * @param {string} url - the URL of the image
 * @return {string} the modified image URL
 */
export const hiRes = (size: number, url: string | null | undefined) => {
  if (!url) return "";
  if (!url.includes("googleusercontent")) return url;
  const newUrl = url.replace(/=s96-c/, `=s${size}`);
  return newUrl;
};

export const formatUserData = (data: Record<string, any>) => {
  const user: User = {
    id: data.ID,
    name: data.displayName || data.name,
    email: data.email,
    isAdmin: data.isAdmin,
    avatarUrl: data.customAvatarUrl || data.avatarUrl,
  };
  if (data.affiliation) {
    user.affiliation = data.affiliation.name;
  }
  if (data.gradYear) {
    user.gradYear = data.gradYear;
  }
  return user;
};

export const isBrowser = typeof window !== "undefined";

/**
 * Generates a set of languages based on the input string.
 *
 * @param {string} s - the input string to search for languages
 * @return {Set<string>} a set containing languages found in the input string
 */
export const languagesToSet = (s: string): Set<string> => {
  const set = new Set<string>();
  if (!s) return set;
  s = s.toLowerCase();
  if (s.includes("english")) {
    set.add("english");
  }
  if (s.includes("hebrew")) {
    set.add("hebrew");
  }
  if (s.includes("aramaic")) {
    set.add("aramaic");
  }
  return set;
};
