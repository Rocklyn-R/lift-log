import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store";

export const TimeSlice = createSlice({
    name: "time",
    initialState: {
        hours: 0,
        minutes: 0,
        seconds: 0,
        secondsLeft: 0,
        timerPaused: true,
    },
    reducers: {
        setTimerTime: (state, action) => {
            const { hours, minutes, seconds} = action.payload;
            state.hours = hours;
            state.minutes = minutes;
            state.seconds = seconds
            state.secondsLeft = (hours * 3600) + (minutes * 60) + seconds;
        },
        tick: (state) => {
            if (state.timerPaused) {
                return;
            }
            if (state.secondsLeft === 0) {
                state.timerPaused = true;
                state.secondsLeft = (state.hours * 3600) + (state.minutes * 60) + state.seconds;
            } else {
                state.secondsLeft = state.secondsLeft - 1;
            }
        },
        playTimer: (state) => {
            state.timerPaused = false;
        },
        pauseTimer: (state) => {
            state.timerPaused = true;
        },
        resetTimer: (state) => {
            state.secondsLeft = (state.hours * 3600) + (state.minutes * 60) + state.seconds;
            state.timerPaused = true;
        }
    }
})

export const {
    setTimerTime,
    tick,
    playTimer,
    pauseTimer,
    resetTimer
} = TimeSlice.actions;

export const selectHours = (state: RootState) => state.time.hours;
export const selectMinutes = (state: RootState) => state.time.minutes;
export const selectSeconds = (state: RootState) => state.time.seconds;
export const selectSecondsLeft = (state: RootState) => state.time.secondsLeft;
export const selectTimerPaused = (state: RootState) => state.time.timerPaused;


export default TimeSlice.reducer;