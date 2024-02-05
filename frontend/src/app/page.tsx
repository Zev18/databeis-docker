import Login from "./Login";
import Logout from "./Logout";
import Ping from "./Ping";
import TestForm from "./TestForm";

export default async function Home() {
  return (
    <div className="m-10 flex flex-col gap-4">
      <TestForm />
    </div>
  );
}
