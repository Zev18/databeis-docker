import { atom } from "jotai";

export const navOpenAtom = atom(false);

export const openSeferAtom = atom<Record<string, any> | null>(null);

export const prevPathAtom = atom<string | null>(null);
