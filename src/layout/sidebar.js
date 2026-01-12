import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
  Box,
  Collapse,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarMenu } from "./sidebarMenu";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

// const filterMenuByRole = (menu, role) => {
//   return menu
//     .map((item) => {
//       if (item.children) {
//         const filteredChildren = item.children.filter(
//           (child) => !child.roles || child.roles.includes(role)
//         );
//         return item.roles?.includes(role) && filteredChildren.length > 0
//           ? { ...item, children: filteredChildren }
//           : null;
//       }
//       return item.roles?.includes(role) ? item : null;
//     })
//     .filter(Boolean);
// };

const filterMenuByRole = (menu, role) => {
  return menu
    .map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter(
          (child) => !child.roles || child.roles.includes(role)
        );
        return filteredChildren.length > 0
          ? { ...item, children: filteredChildren }
          : null;
      }
      // menu tanpa children → dianggap general
      return item;
    })
    .filter(Boolean);
};

export default function Side({ sidebarOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userLogin"));
  const role = user?.role?.toLowerCase();
  const [openSection, setOpenSection] = useState(null);

  // const filteredMenu = sidebarMenu.filter((item) => item.roles?.includes(role));
  const filteredMenu = filterMenuByRole(sidebarMenu, role);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  console.log("IS MOBILE:", isMobile);

  return (
    <>
      <Drawer
        // variant="persistent"
        variant={isMobile ? "temporary" : "persistent"}
        open={sidebarOpen}
        onClose={toggleSidebar}
        sx={{
          width: isMobile ? "auto" : drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {filteredMenu.map((item) => {
              const isActive = location.pathname.startsWith(item.path || "");

              if (item.children) {
                return (
                  <div key={item.label}>
                    <ListItemButton
                      onClick={() =>
                        setOpenSection((prev) =>
                          prev === item.label ? null : item.label
                        )
                      }
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                    <Collapse
                      in={openSection === item.label}
                      timeout="auto"
                      unmountOnExit
                    >
                      <List component="div" disablePadding>
                        {item.children.map((child) => {
                          const isChildActive = location.pathname.startsWith(
                            child.path
                          );
                          return (
                            <ListItemButton
                              key={child.path}
                              // sx={{ pl: 4 }}
                              sx={{
                                pl: 4,
                                "&.Mui-selected": {
                                  bgcolor: "primary.main",
                                  color: "white",
                                },
                                "&.Mui-selected:hover": {
                                  bgcolor: "primary.dark",
                                },
                              }}
                              selected={isChildActive}
                              // onClick={() => navigate(child.path)}
                              onClick={() => {
                                navigate(child.path);
                                if (isMobile) toggleSidebar(); // tutup drawer di mobile
                              }}
                            >
                              <ListItemIcon>{child.icon}</ListItemIcon>
                              <ListItemText primary={child.label} />
                            </ListItemButton>
                          );
                        })}
                      </List>
                    </Collapse>
                  </div>
                );
              }

              return (
                <ListItemButton
                  key={item.path}
                  selected={isActive}
                  // onClick={() => navigate(item.path)}
                  sx={{
                    "&.Mui-selected": {
                      bgcolor: "primary.main",
                      color: "white",
                    },
                    "&.Mui-selected:hover": { bgcolor: "primary.dark" },
                  }}
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) toggleSidebar(); // tutup drawer di mobile
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
