import { createSlice } from "@reduxjs/toolkit";
import { getTodayDate } from "../utilities/utilities";
import { RootState } from "./store";

export const LogsSlice = createSlice({
    name: "logs",
    initialState: {
        workouts: [
            {
                id: 1,
                date: '2024-11-29',
                exercises: [
                    {
                        id: 1,
                        name: 'Squat',
                        sets: [
                            {
                                weight: 135,
                                reps: 3
                            }
                        ]
                    }
                ]
            }
        ], // Tracks workouts by date
        selectedDate: getTodayDate() // Currently selected date in the calendar
    },
    reducers: {
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload;
        }
    }
})

export const { setSelectedDate } = LogsSlice.actions;

export const selectSelectedDate = (state: RootState) => state.logs.selectedDate;


export default LogsSlice.reducer;