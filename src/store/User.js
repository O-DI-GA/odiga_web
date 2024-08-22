import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'userToken',
    initialState: {
        studentName: null,
    },
    reducers: {
        SET_USER: (state, action) => {
            state.studentName = action.payload.studentName;
        },
        DELETE_USER: (state) => {
            state.studentName = null;
        },
    },
});

export const { SET_USER, DELETE_USER } = userSlice.actions;

export default userSlice.reducer;
