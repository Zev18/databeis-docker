import Link from "next/link";
import ProfileCard from "./ProfileCard";

export default function Header() {
  return (
    <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b-2 border-secondary bg-background p-5">
      <Link
        href="/"
        className="text-3xl font-bold"
        style={{ lineHeight: "10px", height: "10px" }}
      >
        Databeis
      </Link>
      <ProfileCard />
    </header>
  );
}
