import { atom } from "jotai";

export const navOpenAtom = atom(false);

export const openSeferAtom = atom<Record<string, any> | null>(null);
