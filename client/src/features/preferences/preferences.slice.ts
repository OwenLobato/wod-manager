import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Theme, Language, Unit } from '@/types/preferences.ts';

interface PreferencesState {
  theme: Theme;
  language: Language;
  unit: Unit;
}

const initialState: PreferencesState = {
  theme: 'light',
  language: 'es',
  unit: 'lb',
};

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
  },
});

export const { setTheme, toggleTheme, setLanguage, setUnit } = preferencesSlice.actions;
export default preferencesSlice.reducer;
