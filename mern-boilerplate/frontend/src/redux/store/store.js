import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";

// Configure the Redux store
const store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable check for actions
        }),
    devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools only in development
});

export default store;
