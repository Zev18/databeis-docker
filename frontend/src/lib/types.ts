import dynamicIconImports from "lucide-react/dynamicIconImports";

export type User = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  avatarUrl: string;
};

export type PageInfo = {
  name: string;
  path: string;
  icon: React.ReactNode;
};
