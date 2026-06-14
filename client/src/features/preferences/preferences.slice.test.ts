import { describe, it, expect } from 'vitest';
import reducer, { toggleTheme, setUnit, setLanguage } from './preferences.slice.ts';

const initial = { theme: 'light', language: 'es', unit: 'lb' } as const;

describe('preferences.slice', () => {
  it('toggles the theme', () => {
    expect(reducer(initial, toggleTheme()).theme).toBe('dark');
  });

  it('sets the unit', () => {
    expect(reducer(initial, setUnit('kg')).unit).toBe('kg');
  });

  it('sets the language', () => {
    expect(reducer(initial, setLanguage('en')).language).toBe('en');
  });
});
