import { configureStore, combineReducers } from "@reduxjs/toolkit";
import logsReducer from "./LogsSlice";

export interface RootState {
    logs: ReturnType<typeof logsReducer>;
}

const store = configureStore({
    reducer: combineReducers({
        logs: logsReducer
    })
})

export default store;