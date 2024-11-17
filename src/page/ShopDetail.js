import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import CategoryMenuList from "./CategoryMenuList";
import TableSetting from "./TableSetting";
import ReserveInfo from "./ReserveInfo";
import UpdateStore from "./UpdateStore";
import Analysis from "./Analysis";

import styled from "styled-components";

const StyledContainer = styled.div`
  margin-top: 70px;
`;

const drawerWidth = 220;

function ShopDetail(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState("매출 분석");

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    setMobileOpen(false);
  };

  const drawer = (
    <div>
      <List>
        {[
          "매출 분석",
          "카테고리 및 메뉴 등록",
          "테이블 정보 등록",
          "예약 가능 시간 정보",
          "가게 정보 수정",
        ].map((text) => (
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
      case "매출 분석":
        return <Analysis />;
      case "카테고리 및 메뉴 등록":
        return <CategoryMenuList />;
      case "테이블 정보 등록":
        return <TableSetting />;
      case "예약 가능 시간 정보":
        return <ReserveInfo />;
      case "가게 정보 수정":
        return <UpdateStore />;
      default:
        return null;
    }
  };

  return (
    <StyledContainer>
      <Box sx={{ display: "flex" }}>
        <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
            zIndex: 1200,
            backgroundColor: "#f4f4f4",
          }}
          aria-label="mailbox folders"
        >
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
                margin: "5rem 20px",
                borderRadius: "10px", // 둥근 테두리
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // 그림자 추가
                height: "auto",
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                borderRadius: "10px", // 둥근 테두리
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // 그림자 추가
                height: "auto",
                margin: "5rem 20px",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            padding: "10px 35px 0px 50px",
            width: { sm: `calc(100% - ${drawerWidth + 32}px)` }, // 좌우 마진에 따른 너비 조정
            backgroundColor: "#F4F4F4",
            minHeight: "100vh",
          }}
        >
          <div>{renderContent()}</div>
        </Box>
      </Box>
    </StyledContainer>
  );
}

ShopDetail.propTypes = {
  window: PropTypes.func,
};

export default ShopDetail;
