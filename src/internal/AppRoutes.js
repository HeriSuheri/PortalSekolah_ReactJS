import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";
// import { useAuth } from "./AuthContext";
import LoginPage from "../pages/login/Login";
import ForgotPasswordPage from "../pages/login/forgotPassword";
import ResetPasswordPage from "../pages/login/forgotPassword/ResetPassword";
// import RegisterPage from "../pages/register/register";
import Container from "../layout/Container";
import Dashboard from "../pages/dashboard/Dashboard";
import Kelas from "../pages/kelas";
import Siswa from "../pages/siswa";
import Admin from "../pages/admin";
import Profile from "../pages/profile/Profile";
import NotFound from "../components/NotFound";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

export default function AppRoutes() {
  // const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          {/* <Route path="/register" element={<RegisterPage />} /> */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Container />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="akademik/kelas" element={<Kelas />} />
            <Route path="manajemen/siswa" element={<Siswa />} />
            <Route path="manajemen/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
