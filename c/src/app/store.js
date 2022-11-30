import { configureStore } from "@reduxjs/toolkit";
import useReducer from "../features/userSlice";
import { getDefaultMiddleware } from '@reduxjs/toolkit';

const customizedMiddleware = getDefaultMiddleware({
    serializableCheck: false
})

export default configureStore({
    reducer: {
        user: useReducer,
    },
    middleware: customizedMiddleware
});