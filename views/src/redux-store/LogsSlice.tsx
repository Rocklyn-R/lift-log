import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exercise, SetList } from "../types/types";
import { getTodayDate } from "../utilities/utilities";
import { RootState } from "./store";

export const LogsSlice = createSlice({
    name: "logs",
    initialState: {
        workout: [], // Tracks workouts by date
        selectedDate: getTodayDate(), // Currently selected date in the calendar
        selectedCategory: "" as string,
        selectedExercise: null as Exercise | null,
        setList: [] as SetList[]
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
        addToSetList: (state, action: PayloadAction<SetList>) => {
            state.setList.push(action.payload);
        }
    }
})

export const { 
    setSelectedDate,
    setSelectedCategory,
    setSelectedExercise,
    addToSetList
} = LogsSlice.actions;

export const selectSelectedDate = (state: RootState) => state.logs.selectedDate;
export const selectSelectedCategory = (state: RootState) => state.logs.selectedCategory;
export const selectSelectedExercise = (state: RootState) => state.logs.selectedExercise;
export const selectSetList = (state: RootState) => state.logs.setList;

export default LogsSlice.reducer;