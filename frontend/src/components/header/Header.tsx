import Link from "next/link";
import ProfileCard from "./ProfileCard";

export default function Header() {
  return (
    <header className="w-full p-5 flex justify-between items-center">
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
