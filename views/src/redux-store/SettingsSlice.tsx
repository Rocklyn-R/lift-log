import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "./store";

export const SettingsSlice = createSlice({
    name: "settings",
    initialState: {
        theme: "light",
        unit_system: "imperial"
    },
    reducers: {
        setUnitSystem: (state, action) => {
            state.unit_system = action.payload
        }
    }
})

export const {
    setUnitSystem
} = SettingsSlice.actions;

export const selectUnitSystem = (state: RootState) => state.settings.unit_system;

export default SettingsSlice.reducer;