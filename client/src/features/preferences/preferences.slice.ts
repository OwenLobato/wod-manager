import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Theme, Language, Unit, UserPreferences } from '@/types/preferences.ts';
import { loadStoredPreferences } from './preferences.storage.ts';

type PreferencesState = UserPreferences;

const initialState: PreferencesState = loadStoredPreferences();

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setLanguage(state, action: PayloadAction<Language>) {
      state.language = action.payload;
    },
    setUnit(state, action: PayloadAction<Unit>) {
      state.unit = action.payload;
    },
    setPercentRange(state, action: PayloadAction<number>) {
      state.percentRange = action.payload;
    },
    /** Replaces the whole slice (used to hydrate from the server profile). */
    hydratePreferences(_state, action: PayloadAction<UserPreferences>) {
      return action.payload;
    },
  },
});

export const { setTheme, toggleTheme, setLanguage, setUnit, setPercentRange, hydratePreferences } =
  preferencesSlice.actions;
export default preferencesSlice.reducer;
