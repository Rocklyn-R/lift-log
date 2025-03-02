import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { act } from "react";
import { SelectedExercise, Workout, SelectedSet } from "../types/types";
import { getTodayDate } from "../utilities/utilities";
import { RootState } from "./store";

export const LogsSlice = createSlice({
    name: "logs",
    initialState: {
        workout: [] as Workout[],
        selectedDate: getTodayDate(), // Currently selected date in the calendar
        selectedCategory: "" as string,
        selectedExercise: null as SelectedExercise | null,
        selectedSet: null as SelectedSet | null,
        totalExercises: 0,
        exerciseHistory: [] as Workout[],
        dateToView: "",
        dateToCopy: "",
        workoutOnDate: [] as Workout[],
        workoutToCopy: [] as Workout[],
        logsLoading: true,
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
        setSelectedSet: (state, action) => {
            state.selectedSet = action.payload;
        },
        addExerciseToWorkout: (state, action: PayloadAction<any>) => {
            const {
                date,
                exercise_id,
                exercise_name,
                set_number,
                exercise_order,
                weight,
                reps,
                id,
                PR,
                weight_lbs,
                PRsToRemove
            } = action.payload;
            const index = state.workout.findIndex(exercise => exercise.exercise_id === action.payload.exercise_id);
            if (index === -1) {
                state.workout.push({
                    date: date,
                    exercise_id: exercise_id,
                    exercise_name: exercise_name,
                    exercise_order: exercise_order,
                    sets: [{
                        weight: weight,
                        reps: reps,
                        set_number: set_number,
                        set_id: id,
                        pr: PR,
                        weight_lbs: weight_lbs
                    }]
                });
            } else {
                if (PRsToRemove.length > 0) {
                    state.workout[index].sets.forEach(set => {
                        if (PRsToRemove.includes(set.set_id)) {
                            set.pr = false;
                        }
                    });
                }
                state.workout[index].sets.push({
                    weight: weight,
                    reps: reps,
                    set_number: set_number,
                    set_id: id,
                    pr: PR,
                    weight_lbs: weight_lbs
                })
            }
        },
        setWorkout: (state, action) => {
            state.workout = action.payload;
        },
        editSet: (state, action) => {
            const { PRData } = action.payload
            const PRsToRemove = PRData.setPRFalse;
            const PRsToAdd = PRData.setPRTrue;
            const foundIndex = state.workout.findIndex(exercise => exercise.exercise_id === action.payload.exercise_id);
            if (foundIndex !== -1) {
                const foundSetIndex = state.workout[foundIndex].sets.findIndex(set => set.set_id === action.payload.id);
                if (foundSetIndex !== -1) {
                    state.workout[foundIndex].sets[foundSetIndex].reps = action.payload.reps;
                    state.workout[foundIndex].sets[foundSetIndex].weight = action.payload.weight;
                }
                if (PRsToAdd.length > 0) {
                    state.workout[foundIndex].sets.forEach(set => {
                        if (PRsToAdd.includes(set.set_id)) {
                            set.pr = true;
                        }
                    });
                }
                if (PRsToRemove.length > 0) {
                    state.workout[foundIndex].sets.forEach(set => {
                        if (PRsToRemove.includes(set.set_id)) {
                            set.pr = false;
                        }
                    });
                }
            }
        },
        deleteSetUpdateSetNumbers: (state, action) => {
            const PRData = action.payload.PRData;
            const foundIndex = state.workout.findIndex(exercise => exercise.exercise_id === action.payload.exercise_id);
            if (foundIndex !== -1) {
                state.workout[foundIndex].sets.forEach(set => {
                    if (set.set_number > action.payload.set_number) {
                        set.set_number -= 1; // Decrease the set_number by 1
                    }
                });
                if (PRData.length > 0) {
                    state.workout[foundIndex].sets.forEach(set => {
                        if (PRData.includes(set.set_id)) {
                            set.pr = true;
                        }
                    });
                }
            }
            const setIndex = state.workout[foundIndex].sets.findIndex(set => set.set_id === action.payload.set_id);
            if (setIndex !== -1) {
                state.workout[foundIndex].sets.splice(setIndex, 1);
                if (setIndex === 0 && state.workout[foundIndex].sets.length === 0) {
                    state.workout.splice(foundIndex, 1);
                }
            }
          
        },
        setExerciseHistory: (state, action) => {
            state.exerciseHistory = action.payload;
        },
        updatePr: (state, action) => {
            const {
                PR
            } = action.payload;
            const foundExerciseIndex = state.workout.findIndex(exercise => exercise.exercise_id === action.payload.exercise_id);
            if (foundExerciseIndex !== -1) {
                const foundSetIndex = state.workout[foundExerciseIndex].sets.findIndex(set => set.set_id === action.payload.set_id);
                if (foundSetIndex !== -1) {
                    state.workout[foundExerciseIndex].sets[foundSetIndex].pr = PR;
                }
            }
        },
        updateExerciseOrder: (state, action) => {
            const { exercise_id, exercise_order } = action.payload;
            const foundIndex = state.workout.findIndex(exercise => exercise.exercise_id === exercise_id);
            if (foundIndex !== -1) {
                state.workout[foundIndex].exercise_order = exercise_order
            }
        },
        setDateToView: (state, action) => {
            state.dateToView = action.payload;
        },
        setDateToCopy: (state, action) => {
            state.dateToCopy = action.payload;
        },
        setWorkoutOnDate: (state, action) => {
            state.workoutOnDate = action.payload;
        },
        setWorkoutToCopy: (state, action) => {
            state.workoutToCopy = action.payload
        },
        setLogsLoading: (state, action) => {
            state.logsLoading = action.payload;
        },
        updateHistoryOnInsert: (state, action) => {
            const { exercise_id, exercise_name, exercise_order } = action.payload;
            const { weight, reps, set_number, id, PR, weight_lbs } = action.payload
            const date = action.payload.date;
            console.log(action.payload.removePRsSetIds);
            const setIdsToUpdate = action.payload.removePRsSetIds; // Array of set_ids to update
            state.exerciseHistory.forEach(history => {
                history.sets.forEach(set => {
                    if (setIdsToUpdate.includes(set.set_id)) {
                        set.pr = false; // Update PR flag
                    }
                });
            });

            const foundIndex = state.exerciseHistory.findIndex(entry => entry.date === date);
            if (foundIndex !== -1) {
                state.exerciseHistory[foundIndex].sets.push({
                    weight: weight,
                    reps: reps,
                    set_number: set_number,
                    set_id: id,
                    pr: PR,
                    weight_lbs: weight_lbs
                })
            } else {
                state.exerciseHistory.unshift({
                    exercise_id: exercise_id,
                    date: date,
                    exercise_name: exercise_name,
                    exercise_order: exercise_order,
                    sets: [{
                        weight: weight,
                        reps: reps,
                        set_number: set_number,
                        set_id: id,
                        pr: PR,
                        weight_lbs: weight_lbs
                    }]
                })
            }
        },
        updateHistoryOnDelete: (state, action) => {
            const { set_id, PRData, date, set_number } = action.payload;
            const foundIndex = state.exerciseHistory.findIndex(entry => entry.date === date);
            if (foundIndex !== -1) {
                console.log("THIS THO?")
                if (state.exerciseHistory[foundIndex].sets.length === 1) {
                    console.log("THIS NOW NOW")
                    state.exerciseHistory.splice(foundIndex, 1);
                } else {
                    const setIndex = state.exerciseHistory[foundIndex].sets.findIndex(set => set.set_id === set_id);
                    if (setIndex !== -1) {
                        state.exerciseHistory[foundIndex].sets.splice(setIndex, 1);
                        if (setIndex === 0 && state.exerciseHistory[foundIndex].sets.length === 0) {
                            state.workout.splice(foundIndex, 1);
                        }
                    }
                    state.exerciseHistory[foundIndex].sets.forEach(set => {
                        if (set.set_number > set_number) {
                            set.set_number -= 1
                        }
                    })
                }
              
                if (PRData.length > 0) {
                    state.exerciseHistory[foundIndex].sets.forEach(set => {
                        if (PRData.includes(set.set_id)) {
                            set.pr = true;
                        }
                    })
                }
            }
          
        },
        updateHistoryOnEdit: (state, action) => {
           const { PRData } = action.payload
            const PRsToRemove = PRData.setPRFalse;
            const PRsToAdd = PRData.setPRTrue;
            const { date, weight, reps, id } = action.payload
            const foundIndex = state.exerciseHistory.findIndex(exercise => exercise.date === date);
            if (foundIndex !== -1) {
                const foundSetIndex = state.exerciseHistory[foundIndex].sets.findIndex(set => set.set_id === id);
                if (foundSetIndex !== -1) {
                    state.exerciseHistory[foundIndex].sets[foundSetIndex].weight = weight;
                    state.exerciseHistory[foundIndex].sets[foundSetIndex].reps = reps;
                }
                if (PRsToAdd.length > 0) {
                    state.exerciseHistory[foundIndex].sets.forEach(set => {
                        if (PRsToAdd.includes(set.set_id)) {
                            set.pr = true;
                        }
                    });
                }
                if (PRsToRemove.length > 0) {
                    state.exerciseHistory[foundIndex].sets.forEach(set => {
                        if (PRsToRemove.includes(set.set_id)) {
                            set.pr = false;
                        }
                    });
                }
            }
        }
    }
})


export const {
    setSelectedDate,
    setSelectedCategory,
    setSelectedExercise,
    setSelectedSet,
    addExerciseToWorkout,
    setWorkout,
    editSet,
    deleteSetUpdateSetNumbers,
    setExerciseHistory,
    updatePr,
    updateExerciseOrder,
    setDateToView,
    setDateToCopy,
    setWorkoutOnDate,
    setWorkoutToCopy,
    setLogsLoading,
    updateHistoryOnInsert,
    updateHistoryOnDelete,
    updateHistoryOnEdit
} = LogsSlice.actions;

export const selectSelectedDate = (state: RootState) => state.logs.selectedDate;
export const selectSelectedCategory = (state: RootState) => state.logs.selectedCategory;
export const selectSelectedExercise = (state: RootState) => state.logs.selectedExercise;
export const selectSelectedSet = (state: RootState) => state.logs.selectedSet;
export const selectWorkout = (state: RootState) => state.logs.workout;
export const selectHistory = (state: RootState) => state.logs.exerciseHistory;
export const selectDateToView = (state: RootState) => state.logs.dateToView;
export const selectDateToCopy = (state: RootState) => state.logs.dateToCopy;
export const selectWorkoutOnDate = (state: RootState) => state.logs.workoutOnDate;
export const selectWorkoutToCopy = (state: RootState) => state.logs.workoutToCopy;
export const selectLogsLoading = (state: RootState) => state.logs.logsLoading;

export default LogsSlice.reducer;