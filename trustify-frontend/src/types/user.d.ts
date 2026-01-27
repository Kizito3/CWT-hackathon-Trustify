interface AuthProviderProps {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<unknown>;
  register: (email: string, password: string) => Promise<unknown>;
  logout: () => void;
}

interface User {
  _id: string;
  email: string;
  full_name: string;
}
