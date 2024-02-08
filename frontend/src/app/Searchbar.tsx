import { Input } from "@/components/ui/input";
import useUrlState from "@ahooksjs/use-url-state";

export default function Searchbar() {
  const [queryState, setQueryState] = useUrlState({ query: "" });

  return (
    <div>
      <Input type="text" placeholder="Search sfarim..." />
    </div>
  );
}
