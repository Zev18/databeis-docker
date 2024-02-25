import MobileNav from "@/components/MobileNav";
import Header from "@/components/header/Header";
import Providers from "@/context/Providers";
import StoreInitializer from "@/context/StoreInitializer";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { apiUrlServer } from "@/lib/consts";
import { User } from "@/lib/types";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const fetchUserData = async () => {
  const res = await fetch(apiUrlServer + "/api/authenticate", {
    credentials: "include",
    headers: headers(), // pass headers from client to backend
  });
  const data = await res.json();
  const user: User = {
    id: data.ID,
    name: data.displayName,
    email: data.email,
    isAdmin: data.isAdmin,
    avatarUrl: data.avatarUrl,
  };
  return user;
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userData = await fetchUserData();

  if (Object.keys(userData).length < 2) {
    useAuthStore.setState({
      user: null,
      isLoggedIn: false,
    });
  } else {
    useAuthStore.setState({
      user: userData,
      isLoggedIn: true,
    });
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <StoreInitializer data={userData} />
        <Providers>
          <MobileNav />
          <Header />
          <main className={GeistSans.variable}>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
