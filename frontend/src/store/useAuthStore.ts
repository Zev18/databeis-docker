import { User } from "@/lib/types";
import { StoreApi, UseBoundStore, create } from "zustand";

type UserStore = {
  user: User | null;
  logoutUser: () => void;
  isLoggedIn: boolean;
};

export const useAuthStore: UseBoundStore<StoreApi<UserStore>> =
  create<UserStore>((set) => ({
    user: null,
    logoutUser: () => {
      set({
        user: null,
        isLoggedIn: false,
      });
    },
    isLoggedIn: false,
  }));
