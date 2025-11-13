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
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { sidebarMenu } from "./sidebarMenu";
import { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

const filterMenuByRole = (menu, role) => {
  return menu
    .map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter(
          (child) => !child.roles || child.roles.includes(role)
        );
        return item.roles?.includes(role) && filteredChildren.length > 0
          ? { ...item, children: filteredChildren }
          : null;
      }
      return item.roles?.includes(role) ? item : null;
    })
    .filter(Boolean);
};

export default function Side({ sidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("userLogin"));
  const role = user?.role?.toLowerCase();
  const [openSection, setOpenSection] = useState(null);

  // const filteredMenu = sidebarMenu.filter((item) => item.roles?.includes(role));
  const filteredMenu = filterMenuByRole(sidebarMenu, role);

  return (
    <>
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          width: drawerWidth,
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
                              sx={{ pl: 4 }}
                              selected={isChildActive}
                              onClick={() => navigate(child.path)}
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
                  onClick={() => navigate(item.path)}
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
