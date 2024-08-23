import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import styled from 'styled-components';

import logoImage from '../../assets/logo.png';
import { useDispatch } from 'react-redux';
import { postLogin } from '../../api/Users';

const defaultTheme = createTheme();

const SubmitBtn = styled.button`
    background-color: #06d1af;
    border: none;
    color: white;
    width: -webkit-fill-available;
    height: 40px;
    border-radius: 5px;
    margin-top: 30px;
`;

export default function Login() {
    const dispatch = useDispatch();

    // 로그인
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const userData = {
            id: data.get('id'),
            password: data.get('password'),
        };

        const loginSuccess = await postLogin(userData, dispatch);

        if (loginSuccess) {
            alert('성공');
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <img src={logoImage} alt="logo" style={{ width: '8rem' }}></img>
                    <Typography component="h1" variant="h5">
                        <b>LOGIN</b>
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="id"
                            label="아이디"
                            name="id"
                            autoComplete="id"
                            autoFocus
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
                        />
                        <SubmitBtn type="submit">로그인</SubmitBtn>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
