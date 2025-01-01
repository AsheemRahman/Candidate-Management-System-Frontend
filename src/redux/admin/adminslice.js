import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    adminStatus: Boolean,
    users: [],
    error: "",
    loading: false,
};

const ManageUserSlice = createSlice({
    name: "ManageUser",
    initialState,
    reducers: {
        adminLogin: (state, action) => {
            state.adminStatus = true;
        },
        addUser: (state, action) => {
            state.users = action.payload;
        },
        deleteUser: (state, action) => {
            state.users = state.users.filter((item) => item.id !== action.payload);
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        adminLogout: (state, action) => {
            state.adminStatus = false;
        }
    },
});

export const { adminLogin, addUser, deleteUser, setError, setLoading, adminLogout } = ManageUserSlice.actions;
export default ManageUserSlice.reducer;