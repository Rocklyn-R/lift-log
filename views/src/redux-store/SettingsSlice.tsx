import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store";

export const SettingsSlice = createSlice({
    name: "settings",
    initialState: {
        theme: "Dark",
        unit_system: "Metric",
        settingsLoading: true,
    },
    reducers: {
        changeUnitSystem: (state, action) => {
            state.unit_system = action.payload;
            state.settingsLoading = false;
        },
        changeTheme: (state, action) => {
            state.theme = action.payload;
        }
    }
})

export const {
    changeUnitSystem,
    changeTheme
} = SettingsSlice.actions;

export const selectUnitSystem = (state: RootState) => state.settings.unit_system;
export const selectSettingsLoading = (state: RootState) => state.settings.settingsLoading;
export const selectTheme = (state: RootState) => state.settings.theme;

export default SettingsSlice.reducer;