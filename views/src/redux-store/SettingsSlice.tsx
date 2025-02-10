import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store";

export const SettingsSlice = createSlice({
    name: "settings",
    initialState: {
        theme: "light",
        unit_system: "Metric",
        settingsLoading: true
    },
    reducers: {
        changeUnitSystem: (state, action) => {
            state.unit_system = action.payload;
            state.settingsLoading = false;
        }
    }
})

export const {
    changeUnitSystem
} = SettingsSlice.actions;

export const selectUnitSystem = (state: RootState) => state.settings.unit_system;
export const selectSettingsLoading = (state: RootState) => state.settings.settingsLoading;

export default SettingsSlice.reducer;