import { describe, it, expect } from 'vitest';
import reducer, {
  toggleTheme,
  setUnit,
  setLanguage,
  setPercentRange,
  hydratePreferences,
} from './preferences.slice.ts';

const initial = { theme: 'light', language: 'es', unit: 'lb', percentRange: 10 } as const;

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

  it('sets the percent range', () => {
    expect(reducer(initial, setPercentRange(5)).percentRange).toBe(5);
  });

  it('replaces the whole slice when hydrating from the server', () => {
    const server = { theme: 'dark', language: 'en', unit: 'kg', percentRange: 15 } as const;
    expect(reducer(initial, hydratePreferences(server))).toEqual(server);
  });
});
