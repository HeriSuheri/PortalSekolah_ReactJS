import DashboardIcon from "@mui/icons-material/Dashboard";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ClassIcon from "@mui/icons-material/Class";
import GradeIcon from "@mui/icons-material/Grade";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";

export const sidebarMenu = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    roles: ["admin", "guru", "siswa"],
  },
  {
    label: "Akademik",
    icon: <ExpandMoreIcon />,
    roles: ["admin", "guru", "siswa"],
    children: [
      {
        label: "Kelas",
        path: "/akademik/kelas",
        icon: <ClassIcon />,
        roles: ["admin", "guru"],
      },
      {
        label: "Nilai",
        path: "/akademik/nilai",
        icon: <GradeIcon />,
        roles: ["admin", "guru", "siswa"],
      },
      {
        label: "Jadwal",
        path: "/akademik/jadwal",
        icon: <CalendarMonthIcon />,
        roles: ["admin", "guru", "siswa"],
      },
      {
        label: "Absensi",
        path: "/akademik/absensi",
        icon: <AssignmentIndIcon />,
        roles: ["admin", "guru", "siswa"],
      },
      {
        label: "Mata Pelajaran",
        path: "/akademik/mata-pelajaran",
        icon: <SchoolIcon />,
        roles: ["admin", "guru"],
      },
    ],
  },
  {
    label: "Manajemen Data",
    icon: <ExpandMoreIcon />,
    roles: ["admin"],
    children: [
      {
        label: "Data Siswa",
        path: "/manajemen/siswa",
        icon: <PeopleIcon />,
      },
      {
        label: "Manajemen Guru",
        path: "/manajemen/guru",
        icon: <PersonIcon />,
      },
      {
        label: "Manajemen Admin",
        path: "/manajemen/admin",
        icon: <PersonIcon />,
      },
    ],
  },
  {
    label: "Pengaturan",
    icon: <ExpandMoreIcon />,
    roles: ["admin"],
    children: [
      {
        label: "Role",
        path: "/pengaturan/role",
        icon: <PersonIcon />,
      },
      {
        label: "Menu",
        path: "/pengaturan/menu",
        icon: <SettingsIcon />,
      },
    ],
  },
  // {
  //   label: "Profil Saya",
  //   path: "/profile",
  //   icon: <PersonIcon />,
  //   roles: ["admin", "guru", "siswa"],
  // },
];
