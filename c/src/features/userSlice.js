import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import format from "date-fns/format";
let userData = localStorage.getItem("user");

export const userSlice = createSlice({
    name: "user",
    initialState: {
        loader: false,
        user: userData,
        edit: null,
        showModal: false,
        import: false,
        getuser_id: true,
        user_id: "",
        searchData: "",
        eventArr: [],
        signup_user: false,
    },
    reducers: {
        login: (state, action) => {
            localStorage.setItem("user", JSON.stringify(action.payload));
            state.token = action.payload.token;
            let userData = localStorage.getItem("user");
            state.user = userData;
        },
        logout: (state) => {
            localStorage.clear();
            state.token = null;
            state.user = null;
        },
        edit: (state, action) => {
            state.edit = action.payload;
        },
        showModal: (state, action) => {
            state.showModal = action.payload;
        },
        loader: (state, action) => {
            state.loader = action.payload;
        },
        getUserId: (state, action) => {
            state.getuser_id = false;
            state.user_id = action.payload;
        },
        deleteData: (state, action) => {
            state.deleteItem = action.payload;
        },

        signup_user: (state, action) => {
            state.signup_user = action.payload;
        },
    }
});

export const {
    login,
    logout,
    edit,
    showModal,
    closeModal,
    loader,
    getUserId,
    searchData,
    deleteData,
    postData,
    signup_user,
} = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectEdit = (state) => state.user.edit;
export const allStates = (state) => state.user;
export default userSlice.reducer;
