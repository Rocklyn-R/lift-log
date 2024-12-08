import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise, Set } from "../types/types";
import { getTodayDate } from "../utilities/utilities";
import { RootState } from "./store";

export const LogsSlice = createSlice({
    name: "logs",
    initialState: {
        workout: [] as Exercise[], 
        selectedDate: getTodayDate(), // Currently selected date in the calendar
        selectedCategory: "" as string,
        selectedExercise: {} as Exercise,
        setList: [] as Set[],
        selectedSet: {} as Set,
        totalExercises: 0
    },
    reducers: {
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload;
        },
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        setSelectedExercise: (state, action) => {
            state.selectedExercise = action.payload;
        },
        addToSetList: (state, action: PayloadAction<Set>) => {
            state.setList.push(action.payload);
        },
        setSetList: (state, action) => {
            state.setList = action.payload;
        },
        setSelectedSet: (state, action) => {
            state.selectedSet = action.payload;
        },
        addExerciseToWorkout: (state, action) => {
            const index = state.workout.findIndex(exercise => exercise.id === action.payload.id);
            if (index === -1) {
              state.workout.push(action.payload);
            }
        }
    }
})

export const { 
    setSelectedDate,
    setSelectedCategory,
    setSelectedExercise,
    addToSetList,
    setSetList,
    setSelectedSet
} = LogsSlice.actions;

export const selectSelectedDate = (state: RootState) => state.logs.selectedDate;
export const selectSelectedCategory = (state: RootState) => state.logs.selectedCategory;
export const selectSelectedExercise = (state: RootState) => state.logs.selectedExercise;
export const selectSetList = (state: RootState) => state.logs.setList;
export const selectSelectedSet = (state: RootState) => state.logs.selectedSet;

export default LogsSlice.reducer;