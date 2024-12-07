import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const UserSlice = createSlice({
    name: "user",
    initialState: {
        isAuthenticated: false,
        firstName: 'Rocklyn',
        lastName: 'Rusinovic',
        email: 'rocklyn@gmail.com',
        isLoading: true
    },
    reducers: {
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
            state.isLoading = false;
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
export const selectFirstName = (state: RootState) => state.user.firstName;
export const selectLastName = (state: RootState) => state.user.lastName;
export const selectEmail = (state: RootState) => state.user.email;
export const selectIsLoading = (state: RootState) => state.user.isLoading;


export const {
    setIsAuthenticated,
    setUserFirstName,
    setUserLastName,
    setUserEmail
} = UserSlice.actions;


export default UserSlice.reducer;