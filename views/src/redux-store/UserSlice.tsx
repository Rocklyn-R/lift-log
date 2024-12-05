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
        },
        setUserFirstName: (state, action) => {
            state.firstName = action.payload;
        },
        setUserLastName: (state, action) => {
            state.lastName = action.payload;
        },
        setUserEmail: (state, action) => {
            state.email = action.payload
        }
    }
})


export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;

export const {
    setIsAuthenticated,
    setUserFirstName,
    setUserLastName,
    setUserEmail
} = UserSlice.actions;


export default UserSlice.reducer;