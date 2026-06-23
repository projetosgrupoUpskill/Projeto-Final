import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "../api";

const AuthContext = createContext({
  token: null,
  isAuthenticated: false,
  userName: "",
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userName, setUserName] = useState(() => localStorage.getItem("name") || "");
  
  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    setToken(data.token);
    setUserName(data.name);
  };

  const register = async (name, email, password) => {
    await apiRegister(name, email, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken(null);
    setUserName("");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Verifica se o token expirou
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiry = payload.exp * 1000; // converte para ms

      if (Date.now() > expiry) {
        logout();
        window.location.href = "/login";
      }
    }, 30000); // verifica a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ token, login, register, logout, isAuthenticated: !!token, userName }}>
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  return useContext(AuthContext);
}