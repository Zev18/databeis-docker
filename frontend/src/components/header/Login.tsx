import { Button } from "@/components/ui/button";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Login() {
  const login = () => {
    window.location.href = apiUrl + "/api/login";
  };

  return <Button onClick={login}>Login</Button>;
}
