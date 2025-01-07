import { createSlice } from "@reduxjs/toolkit";
import {
    userSignup,
    userLogin,
    loggedInUser,
    forgotPassword,
    resetPassword,
    userProfileUpdate,
    userLogout
} from "./authApiSlice";

const authReducer = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
        message: null,
        isLoading: false,
    },
    reducers: {
        clearAuthMessages: (state) => {
            state.message = null;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("authToken");
        },
    },
    extraReducers: (builder) => {
        // Signup
        builder.addCase(userSignup.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(userSignup.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = action.payload.message;
        });
        builder.addCase(userSignup.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        // Login
        builder.addCase(userLogin.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(userLogin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.message = action.payload.message;
            localStorage.setItem("authToken", action.payload.token);
        });
        builder.addCase(userLogin.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("authToken");
        });

        // Get Logged-in User
        builder.addCase(loggedInUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(loggedInUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.isAuthenticated = true;
        });
        builder.addCase(loggedInUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        // Forgot Password
        builder.addCase(forgotPassword.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(forgotPassword.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = action.payload.message;
        });
        builder.addCase(forgotPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        // Reset Password
        builder.addCase(resetPassword.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(resetPassword.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = action.payload.message;
        });
        builder.addCase(resetPassword.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        // Update Profile
        builder.addCase(userProfileUpdate.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(userProfileUpdate.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.message = action.payload.message;
        });
        builder.addCase(userProfileUpdate.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message;
        });

        // Logout
        builder.addCase(userLogout.fulfilled, (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("authToken");
        });
    },
});

// Actions
export const { clearAuthMessages, logout } = authReducer.actions;

export default authReducer.reducer;
