import { User } from "@/lib/types";
import Image from "next/image";
import { Avatar } from "./ui/avatar";

export default function UserAvatar({
  user,
  className,
  onClick,
}: {
  user: User | null;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Avatar className={className} onClick={onClick}>
      <Image
        alt={user?.name || ""}
        src={user?.avatarUrl || ""}
        referrerPolicy="no-referrer"
        fill
      />
    </Avatar>
  );
}
