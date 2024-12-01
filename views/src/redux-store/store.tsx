import { configureStore, combineReducers } from "@reduxjs/toolkit";
import logsReducer from "./LogsSlice";
import libraryReducer from "./LibrarySlice";

export interface RootState {
    logs: ReturnType<typeof logsReducer>;
    library: ReturnType<typeof libraryReducer>;
}

const store = configureStore({
    reducer: combineReducers({
        logs: logsReducer,
        library: libraryReducer
    })
})

export default store;