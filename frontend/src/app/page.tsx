import Searchbar from "./Searchbar";
import TestForm from "./TestForm";

export default async function Home() {
  return (
    <div className="m-4 flex flex-col gap-4">
      <Searchbar />
    </div>
  );
}
