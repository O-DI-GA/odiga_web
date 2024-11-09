import React from "react";
import { postRegister } from "../../api/Users";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import styled from "styled-components";
import logoImage from "../../assets/logo.png";

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

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = React.useState({
    email: "",
    password: "",
    name: "",
  });

  const [passwordCheck, setPasswordCheck] = React.useState("");
  const [error, setError] = React.useState("");

  // 회원가입
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!userData.email || !userData.password || !userData.name) {
      setError("모든 필드를 입력해 주세요.");
      return;
    }

    if (userData.password !== passwordCheck) {
      setError("비밀번호와 일치하지 않습니다.");
      return;
    }

    const registerSuccess = await postRegister(userData, dispatch);

    if (registerSuccess) {
      navigate("/");
    } else {
      alert("회원가입에 실패했습니다.");
    }
  };

  // 회원가입 설정
  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "passwordCheck") {
      setPasswordCheck(value);
      setError(
        value !== userData.password ? "비밀번호와 일치하지 않습니다." : ""
      );
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

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
            <b>REGISTER</b>
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
              label="이메일"
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="passwordCheck"
              label="비밀번호 확인"
              type="password"
              id="passwordCheck"
              autoComplete="current-password"
              onChange={onChange}
              error={Boolean(error)}
              helperText={error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="이름"
              type="text"
              id="name"
              onChange={onChange}
            />
            <SubmitBtn type="submit">회원가입</SubmitBtn>
            <CancelBtn onClick={() => navigate("/")}>이전으로</CancelBtn>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
