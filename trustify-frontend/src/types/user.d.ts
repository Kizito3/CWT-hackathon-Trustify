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
  password: string;
}

interface walletsProps {
  _id: string;
  name: string;
  createdAt: string;
  currentBalance: number;
}

interface transactionProps {
  _id: string;
  type: string;
  description: string;
  createdAt: string;
  amount: number;
  balanceAfter: number;
}

interface linksProps {
  _id: string;
  token: string;
  walletId?: string;
  walletName?: string;
  monitorUrl?: string;
  createdAt: string;
}
