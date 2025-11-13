import { AuthProvider } from "./internal/AuthContext";
import AppRoutes from "./internal/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
