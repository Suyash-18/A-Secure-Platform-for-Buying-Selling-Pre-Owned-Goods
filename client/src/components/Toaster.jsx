// src/components/Toaster.jsx
import { useEffect } from "react";
import { XCircle, CheckCircle } from "lucide-react";

const Toaster = ({ message, onClose, type = "error" }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const baseStyle =
    "fixed top-6 right-6 z-50 flex items-start px-4 py-3 rounded-lg shadow-lg animate-slide-in w-96 max-w-full border";
  const typeStyles = {
    error: "bg-red-100 border-red-400 text-red-700",
    success: "bg-green-100 border-green-400 text-green-700",
  };
  const Icon = type === "error" ? XCircle : CheckCircle;
  const iconColor = type === "error" ? "text-red-600" : "text-green-600";
  const barColor = type === "error" ? "bg-red-600" : "bg-green-600";
  const bgBar = type === "error" ? "bg-red-300" : "bg-green-300";

  return (
    <div className={`${baseStyle} ${typeStyles[type]}`}>
      <Icon className={`w-6 h-6 mr-2 mt-1 ${iconColor}`} />
      <div className="flex-1">
        <p className="font-semibold capitalize">{type}</p>
        <p>{message}</p>
        <div className={`h-1 mt-2 ${bgBar} relative overflow-hidden rounded`}>
          <div className={`absolute top-0 left-0 h-full ${barColor} animate-fill-bar`}></div>
        </div>
      </div>
    </div>
  );
};

export default Toaster;