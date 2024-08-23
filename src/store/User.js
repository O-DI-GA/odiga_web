import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'userToken',
    initialState: {
        ownerName: null,
    },
    reducers: {
        SET_USER: (state, action) => {
            state.ownerName = action.payload.ownerName;
        },
        DELETE_USER: (state) => {
            state.ownerName = null;
        },
    },
});

export const { SET_USER, DELETE_USER } = userSlice.actions;

export default userSlice.reducer;
