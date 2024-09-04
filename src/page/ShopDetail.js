import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";

// import MenuInsert from "../page/MenuInsert";
import CategoryMenuList from "./CategoryMenuList";

const drawerWidth = 240;

function ShopDetail(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState("카테고리 및 메뉴 등록");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setMobileOpen(false);
  };

  const drawer = (
    <div style={{ zIndex: "1040" }}>
      <Toolbar />
      <Divider />
      <List>
        {["카테고리 및 메뉴 등록", "가게 정보", "사장 정보"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => handleTabClick(text)}>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const renderContent = () => {
    switch (selectedTab) {
      case "카테고리 및 메뉴 등록":
        return <CategoryMenuList />;
      case "가게 정보":
        return <div>가게 정보 페이지 내용</div>;
      case "사장 정보":
        return <div>사장 정보 페이지 내용</div>;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}>
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open>
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}>
        {renderContent()}
      </Box>
    </Box>
  );
}

ShopDetail.propTypes = {
  window: PropTypes.func,
};

export default ShopDetail;
