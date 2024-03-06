"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiUrlClient } from "@/lib/consts";
import { capitalizeEverything, formatUserData } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UserCard from "./UserCard";

const formSchema = z.object({
  name: z.string().trim().optional(),
  affiliation: z.string().optional(),
  gradYear: z.coerce
    .number()
    .min(1948)
    .max(new Date().getFullYear() + 4)
    .optional()
    .or(z.literal("")),
});

export default function ProfileSection({
  affiliations,
}: {
  affiliations: Record<string, any>[];
}) {
  const [editing, setEditing] = useState(false);
  const { user } = useAuthStore.getState();
  useEffect(() => console.log(user), [user]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      affiliation: user?.affiliation || "",
      gradYear: user?.gradYear || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const patchData: Record<string, any> = {
      displayName: values.name || null,
      affiliation:
        values.affiliation && values.affiliation != "none"
          ? { name: values.affiliation }
          : null,
      gradYear: values.gradYear || null,
    };
    console.log(patchData);
    try {
      const res = await fetch(apiUrlClient + "/api/users/" + user?.id, {
        credentials: "include",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patchData),
      });

      if (res.ok) {
        const data = await res.json();
        const newUserData = formatUserData(data);
        useAuthStore.setState({ user: newUserData });
        setEditing(false);
        form.reset(newUserData);
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (e) {
      form.setError("root", {
        message: "Something went wrong.",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-center gap-4">
        <UserCard user={user!}>
          {editing ? (
            <div className="grid w-full grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setEditing(true)}>
              <Edit className="mr-2" size={16} /> Edit profile
            </Button>
          )}
        </UserCard>
        {editing && (
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mb-10 flex w-full max-w-xl flex-col gap-4 rounded-lg border p-4 shadow"
          >
            <h3 className="text-xl font-bold">Edit Profile</h3>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Default name"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormDescription>
                    Change how others view your name. Leave blank to keep the
                    default value.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="affiliation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affiliation</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={field.value || "none"}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {affiliations.map((affiliation) => (
                          <SelectItem
                            key={affiliation.ID}
                            value={affiliation.name}
                          >
                            {capitalizeEverything(affiliation.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gradYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Graduation Year</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" placeholder="None" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={form.formState.isLoading}
              className="max-w-fit self-end"
            >
              {form.formState.isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </form>
        )}
      </div>
    </Form>
  );
}
