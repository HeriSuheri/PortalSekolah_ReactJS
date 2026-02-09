import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from "react-router-dom";
// import { useAuth } from "./AuthContext";
import HomePage from "../pages/home";
import HomePPDB from "../pages/home/HomePPDB";
import RegisterPPDB from "../pages/home/RegisterPPDB";
import CekRegisPPDB from "../pages/home/CekRegister";
import LoginPage from "../pages/login/Login";
import ForgotPasswordPage from "../pages/login/forgotPassword";
import ResetPasswordPage from "../pages/login/forgotPassword/ResetPassword";
// import RegisterPage from "../pages/register/register";
import Container from "../layout/Container";
import Dashboard from "../pages/dashboard/Dashboard";
import JadwalPelajaran from "../pages/akademik/jadwal";
import DetailKelas from "../pages/manajemen/kelas/DetailKelas";
import Mapel from "../pages/manajemen/mapel";
import Admin from "../pages/manajemen/admin";
import Guru from "../pages/manajemen/guru";
import MgmtKelas from "../pages/manajemen/kelas";
import Content from "../pages/setting/content";
// import PPDBRegistrasi from "../pages/ppdb_old";
import PPDBRegistrasi from "../pages/ppdb";
import Arsip from "../pages/arsip";
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
          <Route path="/" element={<HomePage />} />
          <Route path="/homePPDB" element={<HomePPDB />} />
          <Route path="/registerPPDB" element={<RegisterPPDB />} />
          <Route path="/cekRegisterPPDB" element={<CekRegisPPDB />} />
          <Route path="/login" element={<LoginPage />} />
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
            <Route
              path="akademik/jadwal-pelajaran"
              element={<JadwalPelajaran />}
            />
            <Route path="manajemen/admin" element={<Admin />} />
            <Route path="manajemen/guru" element={<Guru />} />
            <Route path="manajemen/mapel" element={<Mapel />} />
            <Route path="manajemen/kelas" element={<MgmtKelas />} />
            <Route path="manajemen/kelas/:id" element={<DetailKelas />} />
            <Route path="ppdb-registrasi" element={<PPDBRegistrasi />} />
            <Route path="arsip" element={<Arsip />} />
            <Route path="pengaturan/content" element={<Content />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
