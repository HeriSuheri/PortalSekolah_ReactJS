import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import LockClockIcon from "@mui/icons-material/LockClock";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../internal/AuthContext";
import Header from "./Header";
import Side from "./sidebar";
import PageWrapper from "../components/PageWrapper";
import ChangePasswordModal from "../components/ModalChangePassword";
import Footer from "./Footer";
import PopupModal from "../components/PopUpModal";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ConfirmModal from "../components/DialogPopup";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const drawerWidth = 0;

export default function Container() {
  const navigate = useNavigate();
  const {
    logout,
    isExpired,
    setIsExpired,
    setOpenModalChangePass,
    openModalChangePass,
  } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openLogout, setOpenLogout] = useState(false);
  // const [openModalChangePass, setOpenModalChangePass] = useState(false);
  const [successChangePassword, setSuccessChangePassword] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Side sidebarOpen={sidebarOpen} />

      {/* Konten utama */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: "margin-left 0.3s ease",
          marginLeft: sidebarOpen ? `${drawerWidth}px` : "-240px",
        }}
      >
        <Header
          toggleSidebar={() => {
            setSidebarOpen(!sidebarOpen);
          }}
          openChangePasswordModal={() => setOpenModalChangePass(true)}
          openLogout={() => setOpenLogout(true)}
        />
        <Toolbar />
        <PageWrapper>
          <Outlet />
          {/* Modal Change Password */}
          {/* {openModalChangePass && ( */}
          <ChangePasswordModal
            open={openModalChangePass}
            close={() => setOpenModalChangePass(false)}
            success={() => setSuccessChangePassword(true)}
          />
          {/* )} */}
          {/* Popup Success Change Password */}
          <PopupModal
            open={successChangePassword}
            title="Berhasil Ubah Password"
            content="Anda telah berhasil ubah password, silakan login kembali dengan password yang baru."
            onClose={() => {
              setSuccessChangePassword(false);
              logout();
              navigate("/");
            }}
            icon={
              <CheckCircleOutlinedIcon sx={{ fontSize: 48, color: "green" }} />
            }
            maxWidth="sm"
            // fullWidth={false}
          />
          {/* Expired Session Handling */}
          <PopupModal
            open={isExpired}
            title="Sesi Berakhir"
            content="Sesi Anda telah berakhir. Silakan login kembali."
            onClose={() => {
              setIsExpired(false);
              logout();
              navigate("/");
            }}
            icon={<LockClockIcon sx={{ fontSize: 48, color: "#f44336" }} />}
            maxWidth="sm"
            // fullWidth={false}
          />
          {/* Logout Confirmation Modal */}
          <ConfirmModal
            open={openLogout}
            title="Konfirmasi Logout"
            content="Apakah Anda yakin ingin logout?"
            icon={<ExitToAppIcon sx={{ fontSize: 75, color: "#f44336" }} />}
            onConfirm={() => {
              setOpenLogout(false);
              logout();
              navigate("/");
            }}
            onCancel={() => setOpenLogout(false)}
          />
        </PageWrapper>
        <Footer />
      </Box>
    </Box>
  );
}
