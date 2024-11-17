import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "styled-components";

import logoImage from "../../assets/logo.png";
import { useDispatch } from "react-redux";
import { postLogin } from "../../api/Users";
import { useNavigate } from "react-router-dom";

// import { doLogout } from "../../api/Users";

const defaultTheme = createTheme();

const SubmitBtn = styled.button`
  background-color: #ffa04c;
  border: none;
  color: black;
  width: -webkit-fill-available;
  height: 40px;
  border-radius: 5px;
  margin-top: 30px;
`;

const CancelBtn = styled.button`
  background-color: #fcc953;
  border: none;
  color: black;
  width: -webkit-fill-available;
  height: 40px;
  border-radius: 5px;
  margin-top: 30px;
`;

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = React.useState({
    email: "",
    password: "",
  });

  // 로그인
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(userData);

    const loginSuccess = await postLogin(userData, dispatch);

    if (loginSuccess) {
      // alert("성공");
      navigate("/");
    }
  };

  // 로그인 설정
  const onChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  // 로그아웃
  /*
  const handleLogOut = (event) => {
    event.preventDefault();
    doLogout(dispatch); // 토큰 삭제 -> 로그아웃
  };
  */

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={logoImage} alt="logo" style={{ width: "8rem" }}></img>
          <Typography component="h1" variant="h5">
            <b>LOGIN</b>
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="아이디"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={onChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onChange}
            />
            <SubmitBtn type="submit">로그인</SubmitBtn>
            <CancelBtn onClick={() => navigate("/signup")}>
              회원가입 하러가기
            </CancelBtn>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
