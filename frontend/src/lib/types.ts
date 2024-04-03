export type User = {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  avatarUrl: string;
  affiliation?: string;
  gradYear?: number;
};

export type PageInfo = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

export type SfarimQuery = {
  query?: string;
  categories?: string[];
  languages?: string[];
  page?: number;
  perPage?: number;
};

export type Category = {
  id: number;
  name: string;
  children?: Category[];
};
