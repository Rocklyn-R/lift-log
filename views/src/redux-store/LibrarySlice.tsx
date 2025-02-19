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
        editExercise: (state, action) => {
            const foundIndex = state.exercises.findIndex(exercise => exercise.exercise_id === action.payload.exercise_id);
            if (foundIndex !== -1) {
                state.exercises[foundIndex] = action.payload;
            }
        },
        removeExercise: (state, action) => {
            const foundIndex = state.exercises.findIndex(exercise => exercise.exercise_id === action.payload.exercise_id);
            if (foundIndex !== -1) {
                state.exercises.splice(foundIndex, 1);
            }
        },
        addExercise: (state, action) => {
            state.exercises.push(action.payload);
            state.exercises.sort((a, b) => a.exercise_name.localeCompare(b.exercise_name));
        }
    }
})


export const { 
    setCategories,
    setExercises,
    editExercise,
    removeExercise,
    addExercise
} = LibrarySlice.actions;

export const selectCategories = (state: RootState) => state.library.categories;
export const selectExercises = (state: RootState) => state.library.exercises;

export default LibrarySlice.reducer;