import { createSlice } from '@reduxjs/toolkit';

export const TOKEN_TIME_OUT = 86400 * 1000;

export const tokenSlice = createSlice({
    name: 'authToken',
    initialState: {
        authenticated: false, //현재 로그인 여부 확인
        accessToken: null, //accessToken 저장
        expiredTime: null, // 토큰 만료 시간
    },
    reducers: {
        //  accessToken 정보 저장
        SET_TOKEN: (state, action) => {
            state.authenticated = true;
            state.accessToken = action.payload;
            state.expiredTime = new Date().getTime() + TOKEN_TIME_OUT;
        },
        //  accessToken 삭제
        DELETE_TOKEN: (state) => {
            state.authenticated = false;
            state.accessToken = null;
            state.expiredTime = null;
        },
    },
});

export const { SET_TOKEN, DELETE_TOKEN } = tokenSlice.actions;

export default tokenSlice.reducer;
