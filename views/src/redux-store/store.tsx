import { configureStore, combineReducers } from "@reduxjs/toolkit";
import logsReducer from "./LogsSlice";
import libraryReducer from "./LibrarySlice";
import userReducer from "./UserSlice";

export interface RootState {
    logs: ReturnType<typeof logsReducer>;
    library: ReturnType<typeof libraryReducer>;
    user: ReturnType<typeof userReducer>;
}

const store = configureStore({
    reducer: combineReducers({
        logs: logsReducer,
        library: libraryReducer,
        user: userReducer
    })
});

export default store;