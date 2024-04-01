import { apiUrlServer } from "@/lib/consts";
import EditForm from "./EditForm";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";

const fetchSefer = async (id: number) => {
  const userRes = await fetch(apiUrlServer + "/api/authenticate", {
    credentials: "include",
    headers: headers(),
  });
  const user = await userRes.json();

  if (!user.isAdmin) {
    redirect("/login");
  }

  const res = await fetch(apiUrlServer + "/api/sfarim/" + id, {
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  return data;
};

export default async function Edit({ params }: { params: { id: string } }) {
  const data = await fetchSefer(Number(params.id));

  return data.status !== "fail" ? (
    <div className="m-4 mb-[25%]">
      <EditForm sefer={data} />
    </div>
  ) : (
    notFound()
  );
}
