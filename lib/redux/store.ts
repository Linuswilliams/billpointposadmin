// store.ts
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Correct storage for web apps
import { rootReducer } from './rootReducer'; 
// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // Specify which reducers you want to persist (e.g., 'user')
};

// Persist the root reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer and logger middleware
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disabling serializable check if necessary
    }).concat(logger), // Add logger to the middleware
});

// Persistor for persistence gate
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
