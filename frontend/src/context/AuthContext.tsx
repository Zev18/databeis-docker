"use client";

import { User } from "@/types";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ContextProps {
  userData: User | null;
  setUserData: Dispatch<SetStateAction<User | null>>;
}

const GlobalContext = createContext<ContextProps>({
  userData: null,
  setUserData: () => {},
});

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = localStorage.getItem("user");
  const parsedUserData = userData ? JSON.parse(userData) : null;
  const [user, setUser] = useState<User | null>(parsedUserData);

  useEffect(() => {
    const checkCookie = async () => {
      if (!user) {
        try {
          const res = await fetch(apiUrl + "/api/authenticate", {
            credentials: "include",
          });
          if (!res.ok) {
            throw Error("unauthorized");
          }
          const data = await res.json();
          const userData = {
            id: data.ID,
            name: data.displayName,
            email: data.email,
            isAdmin: data.isAdmin,
            avatarUrl: data.avatarUrl,
          };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        } catch (e) {
          setUser(null);
          localStorage.removeItem("user");
        }
      }
    };

    if (user) return;
    checkCookie();
  }, [user]);

  return (
    <GlobalContext.Provider value={{ userData: user, setUserData: setUser }}>
      {children}
    </GlobalContext.Provider>
  );
}

export const useAuthContext = () => useContext(GlobalContext);
