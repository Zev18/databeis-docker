import Link from "next/link";
import ProfileCard from "./ProfileCard";

export default function Header() {
  return (
    <header className="w-full p-5 flex justify-between items-center sticky top-0 z-10 bg-background border-b-2 border-secondary">
      <Link
        href="/"
        className="text-3xl font-bold"
        style={{ lineHeight: "10px", height: "10px" }}>
        Databeis
      </Link>
      <ProfileCard />
    </header>
  );
}
