import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000); // Hide after 3s
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <div className="fixed top-4 right-4 z-50"><Toast message={toast.message} /></div>}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

import Toast from "../components/Toaster";
