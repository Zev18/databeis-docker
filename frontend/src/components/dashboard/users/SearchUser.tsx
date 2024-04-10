import UserAvatar from "@/components/UserAvatar";
import { Input } from "@/components/ui/input";
import useDebouncedEffect from "@/hooks/useDebouncedEffect";
import { useUsers } from "@/hooks/useUsers";
import { apiUrlClient } from "@/lib/consts";
import { User } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SearchUser() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const queryClient = useQueryClient();

  const { data: users } = useUsers(debouncedQuery);

  useDebouncedEffect(() => setDebouncedQuery(query), { timeout: 200 }, [query]);

  const addAdmin = useMutation({
    mutationFn: async (userId: number) => {
      return await fetch(`${apiUrlClient}/api/users/make-admin?ids=${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  return (
    <div>
      <Input
        placeholder="Search a user..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <div>
          {!users ? (
            <div className="my-10 flex w-full justify-center">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <div className="my-4 w-full space-y-2">
              {users?.map(
                (user: User) =>
                  !user.isAdmin && (
                    <button
                      key={user.id}
                      className="flex w-full items-center gap-2 rounded-lg border px-4 py-2 hover:bg-secondary"
                      onClick={() => addAdmin.mutate(user.id)}
                    >
                      <Plus className="opacity-60" />
                      <UserAvatar user={user} size="sm" />
                      <p>{user.name}</p>
                      <p className="text-foreground/60">{user.email}</p>
                    </button>
                  ),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
