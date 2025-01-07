import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store";

export const TimeSlice = createSlice({
    name: "time",
    initialState: {
        hours: 0,
        minutes: 0,
        seconds: 0,
        secondsLeft: 0,
        timerRunning: false,
        timerLoading: true,
        stopwatchRunning: false,
        stopwatchStartTime: 0,
        elapsedStopwatchTime: 0
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
            if (!state.timerRunning) {
                return;
            }
            if (state.secondsLeft === 0) {
                state.timerRunning = false;
                state.secondsLeft = (state.hours * 3600) + (state.minutes * 60) + state.seconds;
            } else {
                state.secondsLeft = state.secondsLeft - 1;
            }
        },
        playTimer: (state) => {
            state.timerRunning = true;
        },
        pauseTimer: (state) => {
            state.timerRunning = false;
        },
        resetTimer: (state) => {
            state.secondsLeft = (state.hours * 3600) + (state.minutes * 60) + state.seconds;
            state.timerRunning = false;
        },
        setTimerLoaded: (state) => {
            state.timerLoading = false;
        },
        startStopwatch: (state) => {
            state.stopwatchRunning = true;
            state.stopwatchStartTime = Date.now() - state.elapsedStopwatchTime;
        },
        pauseStopwatch: (state) => {
            state.stopwatchRunning = false;
        },
        setElapsedStopwatchTime: (state, action) => {
            state.elapsedStopwatchTime = action.payload;
        }
    }
})

export const {
    setTimerTime,
    tick,
    playTimer,
    pauseTimer,
    resetTimer,
    setTimerLoaded,
    startStopwatch,
    pauseStopwatch,
    setElapsedStopwatchTime
} = TimeSlice.actions;

export const selectHours = (state: RootState) => state.time.hours;
export const selectMinutes = (state: RootState) => state.time.minutes;
export const selectSeconds = (state: RootState) => state.time.seconds;
export const selectSecondsLeft = (state: RootState) => state.time.secondsLeft;
export const selectTimerRunning = (state: RootState) => state.time.timerRunning;
export const selectTimerLoading = (state: RootState) => state.time.timerLoading;
export const selectStopwatchRunning = (state: RootState) => state.time.stopwatchRunning;
export const selectElapsedTime = (state: RootState) => state.time.elapsedStopwatchTime;
export const selectStopwatchStartTime = (state: RootState) => state.time.stopwatchStartTime;

export default TimeSlice.reducer;