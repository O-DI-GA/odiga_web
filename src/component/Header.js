import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Logo from "../assets/ODIGA_Logo.png";
import "../css/Header.css";

import { useDispatch } from "react-redux";
import { doLogout } from "../api/Users";
import { useNavigate } from "react-router-dom";
import { useStoreId } from "../store/useStore";

import SelectShop from "./SelectShop";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [value, setValue] = React.useState("analysis");
  const storeId = useStoreId();

  // 탭 이동
  const handleChange = (event, newValue) => {
    setValue(newValue);

    if (newValue === "analysis") {
      navigate("/");
    } else if (newValue === "addShop") {
      navigate("/shopinsert");
    }
  };

  // 로그아웃
  const handleLogOut = () => {
    doLogout(dispatch); // 토큰 삭제 -> 로그아웃
    navigate(`/`);
  };

  // storeId 변경 시 리렌더링 및 탭 초기화
  React.useEffect(() => {
    if (storeId && value === "analysis") {
      navigate(`/`);
    }
  }, [storeId, navigate, value]);

  return (
    <div className="header">
      <div className="left-box">
        <img src={Logo} alt="ODIGA" className="logo" />
        <div className="navigation-bar">
          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="#000"
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#FFA04C",
                },
              }}
            >
              <Tab value="analysis" label="매출 분석" />
              <Tab value="addShop" label="가게 등록" />
            </Tabs>
          </Box>
        </div>
      </div>
      <div className="right-box">
        {value !== "addShop" && <SelectShop />}
        <p className="hello-txt"> 안녕하세요, 반갑습니다.</p>
        <div className="logout-box" onClick={handleLogOut}>
          <p className="logout-txt"> 로그아웃</p>
        </div>
      </div>
    </div>
  );
}
