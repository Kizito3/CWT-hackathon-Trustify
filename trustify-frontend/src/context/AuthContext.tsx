import { createContext, useContext, useEffect, useState } from "react";
import instance from "../api/axios";

const AuthContext = createContext<AuthProviderProps | null>(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await instance.get("/auth/verify");
          if (response.data.valid) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem("token");
          }
        } catch {
          localStorage.removeItem("token");
        }
      }
      setIsloading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await instance.post("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (email: string, password: string) => {
    console.log("Full Request URL:", instance.defaults.baseURL + "/auth/login");
    const response = await instance.post("/auth/register", { email, password });
    localStorage.setItem("token", response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
