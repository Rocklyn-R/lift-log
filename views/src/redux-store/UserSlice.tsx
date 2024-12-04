import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const UserSlice = createSlice({
    name: "user",
    initialState: {
        isAuthenticated: false,
        firstName: '',
        lastName: '',
        email: '',
    },
    reducers: {
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        }
    }
})


export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

export const {
    setIsAuthenticated
} = UserSlice.actions;


export default UserSlice.reducer;