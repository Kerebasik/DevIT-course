import { combineReducers, configureStore } from "@reduxjs/toolkit";
import gameReducer from './reducers/gameSlice';

const rootReducer = combineReducers({
    gameReducer
});

const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        devTools: true,
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware({ serializableCheck: true });
        }
    });
};

export { setupStore };