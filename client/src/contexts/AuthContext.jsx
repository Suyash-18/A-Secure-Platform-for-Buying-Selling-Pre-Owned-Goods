// src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// Create the context for authentication
const AuthContext = createContext();

// AuthProvider component to manage authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Hydrate user from localStorage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Restore user data if available in localStorage
    }
  }, []);

  // Function to log in a user
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));  // Store user in localStorage
  };

  // Function to log out a user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");  // Remove user data from localStorage on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
