"use client";

import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "@/types";

const isServer = typeof window === "undefined";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface ContextProps {
  userData: User | null;
  setUserData: Dispatch<SetStateAction<User | null>>;
  ready: boolean;
}

const Context = createContext<ContextProps>({
  userData: null,
  setUserData: () => {},
  ready: false,
});

export default function AuthContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null); // Initialize with null
  const [ready, setReady] = useState(false);

  // update after component mount
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
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } catch (e) {
          setUser(null);
          localStorage.removeItem("user");
        }
        setReady(true);
      }
    };

    if (user) {
      setReady(true);
      return;
    }
    checkCookie();
  }, [user]);

  return (
    <Context.Provider value={{ userData: user, setUserData: setUser, ready }}>
      {children}
    </Context.Provider>
  );
}

export const useAuthContext = () => useContext(Context);

const getUser = () => {
  if (isServer) return null;
  let user;
  try {
    user = localStorage.getItem("user");
  } catch (e) {}
  return user;
};
