import { apiUrlClient } from "@/lib/consts";
import { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useUsers(query: string) {
  const usersQuery = useQuery<User[], Error>({
    queryKey: ["userSearch", query],
    queryFn: async () => {
      const data = await fetch(
        apiUrlClient + "/api/users/search?query=" + query,
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      const userData = await data.json();
      const users = [];
      for (const u of userData) {
        const user: User = {
          id: u.ID,
          isHidden: u.isHidden,
          name: u.name,
          email: u.email,
          isAdmin: u.isAdmin,
          avatarUrl: u.customAvatarUrl || u.avatarUrl,
        };
        if (u.affiliation) {
          user.affiliation = u.affiliation.name;
        }
        if (u.gradYear) {
          user.gradYear = u.gradYear;
        }
        users.push(user);
      }
      return users;
    },
  });

  return usersQuery;
}
