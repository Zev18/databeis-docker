"use client";

import { useRef } from "react";

import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/lib/types";

function StoreInitializer({ data }: { data: User }) {
  const initialized = useRef(false);
  if (!data || Object.keys(data).length < 2) {
    useAuthStore.setState({
      user: null,
      isLoggedIn: false,
    });
  } else if (!initialized.current) {
    useAuthStore.setState({
      user: data,
      isLoggedIn: true,
    });
    initialized.current = true;
  }
  return null;
}

export default StoreInitializer;
