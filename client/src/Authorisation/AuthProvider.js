import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const login = (token, name, role, shopPhoto, shopName) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    localStorage.setItem("shopPhoto", shopPhoto || "shop shopPhoto not found");
    localStorage.setItem("shopname", shopName || "shop name not found");
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("shopDetails");
    setToken("");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/auth/verify",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.data.user) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          logout();
        }
      } else {
        logout();
      }
    };
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
