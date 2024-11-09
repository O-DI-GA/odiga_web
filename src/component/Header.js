import React from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Logo from "../assets/ODIGA_Logo.png";
import "../css/Header.css"

import {useDispatch} from "react-redux";
import { doLogout } from "../api/Users";

export default function Header() {
    const dispatch = useDispatch();

    const [value, setValue] = React.useState('analysis');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    // 로그아웃
    const handleLogOut = () => {
        doLogout(dispatch); // 토큰 삭제 -> 로그아웃
    };


  return (
      <div className="header">
          <div className="left-box">
              <img src={Logo} alt="ODIGA" className="logo"/>
              <div className="navigation-bar">
                  <Box sx={{ width: '100%' }}>
                      <Tabs
                          value={value}
                          onChange={handleChange}
                          textColor="#000"
                          TabIndicatorProps={{
                              style: {
                                  backgroundColor: "#FFA04C",
                              }
                          }}
                      >
                          <Tab value="analysis" label="매출 분석"/>
                          <Tab value="addShop" label="가게 등록" />
                      </Tabs>
                  </Box>
              </div>
          </div>
          <div className="right-box">
              <p className="hello-txt"> 안녕하세요, 반갑습니다.</p>
              <div className="logout-box" onClick={() => handleLogOut()}>
                  <p className="logout-txt"> 로그아웃</p>
              </div>
          </div>
      </div>
  );
}




