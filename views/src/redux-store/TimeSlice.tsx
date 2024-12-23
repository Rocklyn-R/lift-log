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
        timerLoading: true
    },
    reducers: {
        setTimerTime: (state, action) => {
            const { hours, minutes, seconds, seconds_left } = action.payload;
            state.hours = hours;
            state.minutes = minutes;
            state.seconds = seconds
            state.secondsLeft = seconds_left;
            state.timerLoading = false;
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
        },
        setTimerLoaded: (state) => {
            state.timerLoading = false;
        }
    }
})

export const {
    setTimerTime,
    tick,
    playTimer,
    pauseTimer,
    resetTimer,
    setTimerLoaded
} = TimeSlice.actions;

export const selectHours = (state: RootState) => state.time.hours;
export const selectMinutes = (state: RootState) => state.time.minutes;
export const selectSeconds = (state: RootState) => state.time.seconds;
export const selectSecondsLeft = (state: RootState) => state.time.secondsLeft;
export const selectTimerPaused = (state: RootState) => state.time.timerPaused;
export const selectTimerLoading = (state: RootState) => state.time. timerLoading;

export default TimeSlice.reducer;