import { createContext, useEffect, useState, useMemo } from "react";
import ChatService from "../services/ChatService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    try {
      ChatService.disconnect();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  const role = user?.role || "";
  const isSuperAdmin = role === "SUPER_ADMIN";
  const isAdmin = role === "ADMIN" || isSuperAdmin;
  const isPartner = role === "PARTNER";
  const isClient = role === "CLIENT";
  const isCandidate = role === "CANDIDATE";

  const hasRole = (...roles) => {
    if (!role) return false;
    if (isSuperAdmin) return true; // Super admin has authority across modules
    return roles.flat().includes(role);
  };

  const contextValue = useMemo(
    () => ({
      user,
      role,
      isSuperAdmin,
      isAdmin,
      isPartner,
      isClient,
      isCandidate,
      hasRole,
      login,
      logout,
      loading,
      setLoading,
    }),
    [user, role, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;