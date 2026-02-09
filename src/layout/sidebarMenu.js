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
import GridViewTwoToneIcon from "@mui/icons-material/GridViewTwoTone";
import AppRegistration from "@mui/icons-material/AppRegistration";
import ArchiveTwoToneIcon from "@mui/icons-material/ArchiveTwoTone";
import DatasetTwoToneIcon from "@mui/icons-material/DatasetTwoTone";

export const sidebarMenu = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    // tidak perlu roles → otomatis general
  },
  {
    label: "Akademik",
    icon: <ExpandMoreIcon />,
    children: [
      // {
      //   label: "Kelas",
      //   path: "/akademik/kelas",
      //   icon: <ClassIcon />,
      //   roles: ["admin", "guru"],
      // },
      {
        label: "Jadwal",
        path: "/akademik/jadwal",
        icon: <CalendarMonthIcon />,
        roles: ["siswa"],
      },
      {
        label: "Nilai",
        path: "/akademik/nilai",
        icon: <GradeIcon />,
        roles: ["siswa"],
      },
      {
        label: "Absensi",
        path: "/akademik/absensi",
        icon: <AssignmentIndIcon />,
        roles: ["siswa"],
      },
      // PEMBAYARAN, TUGAS, UJIAN, DLL
      // {
      //   label: "Mata Pelajaran",
      //   path: "/akademik/mata-pelajaran",
      //   icon: <SchoolIcon />,
      //   roles: ["admin", "guru"],
      // },
    ],
  },
  {
    label: "Manajemen Data",
    icon: <ExpandMoreIcon />,
    children: [
      // {
      //   label: "Data Siswa",
      //   path: "/manajemen/siswa",
      //   icon: <PeopleIcon />,
      //   roles: ["admin"],
      // },
      {
        label: "Manajemen Guru",
        path: "/manajemen/guru",
        icon: <PersonIcon />,
        roles: ["admin", "guru"],
      },
      {
        label: "Manajemen Admin",
        path: "/manajemen/admin",
        icon: <PersonIcon />,
        roles: ["admin"],
      },
      {
        label: "Manajemen Kelas",
        path: "/manajemen/kelas",
        icon: <GridViewTwoToneIcon />,
        roles: ["admin", "guru"],
      },
      {
        label: "Manajemen Mapel",
        path: "/manajemen/mapel",
        icon: <SchoolIcon />,
        roles: ["admin", "guru"],
      },
    ],
  },
  {
    label: "Pengaturan",
    icon: <ExpandMoreIcon />,
    children: [
      {
        label: "Content",
        path: "/pengaturan/content",
        icon: <DatasetTwoToneIcon />,
        roles: ["admin"],
      },
      // {
      //   label: "Menu",
      //   path: "/pengaturan/menu",
      //   icon: <SettingsIcon />,
      //   roles: ["admin", "guru"],
      // },
    ],
  },
  {
    label: "PPDB",
    path: "/ppdb-registrasi",
    icon: <AppRegistration />,
    roles: ["admin"],
    // tidak perlu roles → otomatis general
  },
  {
    label: "Arsip",
    path: "/arsip",
    icon: <ArchiveTwoToneIcon />,
    roles: ["admin"],
  },
];
