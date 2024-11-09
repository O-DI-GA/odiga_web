import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'storeInfo',
    initialState: {
        storeId: null,
    },
    reducers: {
        SET_STOREID: (state, action) => {
            state.storeId = action.payload.storeId;
        },
        DELETE_STOREID: (state) => {
            state.storeId = null;
        },
    },
});

export const { SET_STOREID, DELETE_STOREID } = userSlice.actions;

export default userSlice.reducer;
