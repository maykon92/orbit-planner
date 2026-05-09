import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("orbitUser")) || null;
  });

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });

    localStorage.setItem("orbitUser", JSON.stringify(data));
    setUser(data);

    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);

    localStorage.setItem("orbitUser", JSON.stringify(data));
    setUser(data);

    return data;
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem("orbitUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem("orbitUser");
    setUser(null);
  };

  useEffect(() => {
    const validateSession = async () => {
      if (!user?.token) return;

      try {
        const { data } = await api.get("/auth/me");
        setUser((prev) => ({ ...prev, ...data }));
      } catch {
        logout();
      }
    };

    validateSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);