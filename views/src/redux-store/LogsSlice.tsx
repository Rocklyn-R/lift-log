import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SelectedExercise, Set, Exercise, Workout } from "../types/types";
import { getTodayDate } from "../utilities/utilities";
import { RootState } from "./store";

export const LogsSlice = createSlice({
    name: "logs",
    initialState: {
        workout: [] as Workout[], 
        selectedDate: getTodayDate(), // Currently selected date in the calendar
        selectedCategory: "" as string,
        selectedExercise: null as SelectedExercise | null,
        setList: [] as Set[],
        selectedSet: null as Set | null,
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
        addExerciseToWorkout: (state, action: PayloadAction<any>) => {
            const {date, exercise_id, exercise_name, set_number, exercise_order, weight, reps} = action.payload;
            const index = state.workout.findIndex(exercise => exercise.exercise_id === action.payload.exercise_id);
            if (index === -1) {
             state.workout.push({
                date: date,
                exercise_id: exercise_id,
                exercise_name: exercise_name,
                exercise_order: exercise_order,
                sets: [ {
                    weight: weight,
                    reps: reps,
                    set_number: set_number
                }]
              });
            } else {
                state.workout[index].sets.push({
                    weight: weight,
                    reps: reps,
                    set_number: set_number
                })
            }
        },
        setWorkout: (state, action) => {
            state.workout = action.payload;
        }

    }
})


export const { 
    setSelectedDate,
    setSelectedCategory,
    setSelectedExercise,
    addToSetList,
    setSetList,
    setSelectedSet,
    addExerciseToWorkout,
    setWorkout
} = LogsSlice.actions;

export const selectSelectedDate = (state: RootState) => state.logs.selectedDate;
export const selectSelectedCategory = (state: RootState) => state.logs.selectedCategory;
export const selectSelectedExercise = (state: RootState) => state.logs.selectedExercise;
export const selectSetList = (state: RootState) => state.logs.setList;
export const selectSelectedSet = (state: RootState) => state.logs.selectedSet;
export const selectWorkout = (state: RootState) => state.logs.workout;

export default LogsSlice.reducer;