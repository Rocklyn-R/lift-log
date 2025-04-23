import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store";

export const TrainingProfileSlice = createSlice({
    name: "training_profile",
    initialState: {
        training_goal: "",
        body_composition_goal: "",
        injuries: "",
        isLoading: true,
    },
    reducers: {
        changeTrainingGoal: (state, action) => {
            state.training_goal = action.payload;
        },
        changeBodyCompositionGoal: (state, action) => {
            state.body_composition_goal = action.payload;
        },
        changeInjuries: (state, action) => {
            state.injuries = action.payload;
        },
        setTrainingProfileLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
})

export const {
    changeTrainingGoal,
    changeBodyCompositionGoal,
    changeInjuries,
    setTrainingProfileLoading
} = TrainingProfileSlice.actions;

export const selectTrainingGoal = (state: RootState) => state.training_profile.training_goal;
export const selectBodyCompositionGoal = (state: RootState) => state.training_profile.body_composition_goal;
export const selectInjuries = (state: RootState) => state.training_profile.injuries;
export const selectTrainingProfileLoading = (state: RootState) => state.training_profile.isLoading;

export default TrainingProfileSlice.reducer;