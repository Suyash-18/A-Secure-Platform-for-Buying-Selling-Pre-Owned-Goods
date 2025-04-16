import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import ProductProvider from "./contexts/ProductContext";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ProductProvider>
          <AppRouter />
        </ProductProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;