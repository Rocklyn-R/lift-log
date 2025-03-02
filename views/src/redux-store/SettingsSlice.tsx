import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store";

export const SettingsSlice = createSlice({
    name: "settings",
    initialState: {
        theme: "Light",
        unit_system: "Metric",
        settingsLoading: true,
        pending_email: null
    },
    reducers: {
        changeUnitSystem: (state, action) => {
            state.unit_system = action.payload;
            state.settingsLoading = false;
        },
        changeTheme: (state, action) => {
            state.theme = action.payload;
        },
        setPendingEmail: (state, action) => {
            state.pending_email = action.payload;
        }
    }
})

export const {
    changeUnitSystem,
    changeTheme,
    setPendingEmail
} = SettingsSlice.actions;

export const selectUnitSystem = (state: RootState) => state.settings.unit_system;
export const selectSettingsLoading = (state: RootState) => state.settings.settingsLoading;
export const selectTheme = (state: RootState) => state.settings.theme;
export const selectPendingEmail = (state: RootState) => state.settings.pending_email;

export default SettingsSlice.reducer;