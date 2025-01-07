import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Base URL
const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080/api/v1";

// User Signup
export const userSignup = createAsyncThunk("auth/userSignup", async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/user/signup`, userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// User Login
export const userLogin = createAsyncThunk("auth/userLogin", async (credentials, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/user/login`, credentials);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Get Logged-in User
export const loggedInUser = createAsyncThunk("auth/loggedInUser", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/user/profile`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Forgot Password
export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/user/forgot-password`, { email });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Reset Password
export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/user/reset-password/${token}`, { password });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// Update User Profile
export const userProfileUpdate = createAsyncThunk("auth/userProfileUpdate", async ({ id, updates }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/user/profile/${id}`, updates, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

// User Logout
export const userLogout = createAsyncThunk("auth/userLogout", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/user/logout`, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});
