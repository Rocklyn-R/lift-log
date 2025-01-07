import { configureStore, combineReducers } from "@reduxjs/toolkit";
import logsReducer from "./LogsSlice";
import libraryReducer from "./LibrarySlice";
import userReducer from "./UserSlice";
import timeReducer from "./TimeSlice";
import settingsReducer from "./SettingsSlice";

export interface RootState {
    logs: ReturnType<typeof logsReducer>;
    library: ReturnType<typeof libraryReducer>;
    user: ReturnType<typeof userReducer>;
    time: ReturnType<typeof timeReducer>;
    settings: ReturnType<typeof settingsReducer>
}

const store = configureStore({
    reducer: combineReducers({
        logs: logsReducer,
        library: libraryReducer,
        user: userReducer,
        time: timeReducer,
        settings: settingsReducer
    })
});

export default store;