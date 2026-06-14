import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/auth.slice.ts';
import preferencesReducer from '@/features/preferences/preferences.slice.ts';
import { saveStoredPreferences } from '@/features/preferences/preferences.storage.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
  },
});

// Persist preferences on every change: guest storage + a cache for logged-in users.
let lastPreferences = store.getState().preferences;
store.subscribe(() => {
  const { preferences } = store.getState();
  if (preferences !== lastPreferences) {
    lastPreferences = preferences;
    saveStoredPreferences(preferences);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
