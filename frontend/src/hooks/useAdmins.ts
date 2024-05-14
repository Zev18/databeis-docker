import { apiUrlClient } from "@/lib/consts";
import { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useAdmins(initial?: User[]) {
  const admins = useQuery<User[], Error>({
    queryKey: ["admins"],
    queryFn: async () => {
      const data = await fetch(apiUrlClient + "/api/users/admins");
      const adminsData = await data.json();
      const users = [];
      for (const admin of adminsData) {
        const user: User = {
          id: admin.ID,
          isHidden: admin.isHidden,
          name: admin.name,
          email: admin.email,
          isAdmin: admin.isAdmin,
          avatarUrl: admin.customAvatarUrl || admin.avatarUrl,
        };
        if (admin.affiliation) {
          user.affiliation = admin.affiliation.name;
        }
        if (admin.gradYear) {
          user.gradYear = admin.gradYear;
        }
        users.push(user);
      }
      return users;
    },
    initialData: initial,
  });

  return admins;
}
