import { createSlice } from "@reduxjs/toolkit";
import { Category, Exercise } from "../types/types";
import { RootState } from "./store";

export const LibrarySlice = createSlice({
    name: "library",
    initialState: {
        categories: [] as Category[],
        exercises: [] as Exercise[],
    },
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setExercises: (state, action) => {
            state.exercises = action.payload;
        },
    }
})


export const { 
    setCategories,
    setExercises 
} = LibrarySlice.actions;

export const selectCategories = (state: RootState) => state.library.categories;
export const selectExercises = (state: RootState) => state.library.exercises;

export default LibrarySlice.reducer;