// In-memory access token. Kept out of localStorage on purpose (XSS-safe);
// it is restored on reload via a silent /auth/refresh using the httpOnly cookie.
let accessToken: string | null = null;

export const getAccessToken = (): string | null => accessToken;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};
