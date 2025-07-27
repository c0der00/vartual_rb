import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
    isLoading: false,
    error: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isLoading = false;
            state.status = true;
            state.userData = action.payload.userData;
            state.error = null;
        },
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
            state.status = false;
        },

        loginFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
            state.status = false;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
        }
    }
})

export const { login, logout,loginStart, loginFailure} = authSlice.actions;

export default authSlice.reducer;