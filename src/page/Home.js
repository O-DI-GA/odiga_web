import React from "react";
import { useDispatch } from "react-redux";
import { doLogout } from "../api/Users";


import Header from "../component/Header";

function Home() {
  const dispatch = useDispatch();
  // 로그아웃
  const handleLogOut = (event) => {
    event.preventDefault();
    doLogout(dispatch); // 토큰 삭제 -> 로그아웃
  };

  return (
    <div>
        <Header />
      <h1>Home Page</h1>
      <a href="/ShopInsert"> 가게 등록 </a>
      <a href="/shoplist"> 가게 리스트 </a>
      <div onClick={handleLogOut} style={{ padding: "20px", color: "green" }}>
        {" "}
        로그아웃{" "}
      </div>
    </div>
  );
}

export default Home;
