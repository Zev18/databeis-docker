import { apiUrlClient } from "@/lib/consts";
import { User } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

export function useAdmins(initial?: User[]) {
  const admins = useQuery<User[], Error>({
    queryKey: ["admins"],
    queryFn: async () => {
      const data = await fetch(apiUrlClient + "/api/users/admins");
      const adminsData = await data.json();
      return adminsData;
    },
    initialData: initial,
  });

  return admins;
}
