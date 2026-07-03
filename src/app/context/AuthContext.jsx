"use client";
import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsLoggedIn(true);
        setRole(data.user.role);
        setUser(data.user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error al verificar las credenciales", error);
      return false;
    }
  };

  const register = async (email, password, nombre, edad, telefono) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", email, password, nombre, edad, telefono })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsLoggedIn(true);
        setRole(data.user.role);
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, message: data.message || "Error al registrarse" };
      }
    } catch (error) {
      console.error("Error al registrarse", error);
      return { success: false, message: "Error de red o conexión" };
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRole("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
