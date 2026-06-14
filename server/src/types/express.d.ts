declare namespace Express {
  interface Request {
    user?: {
      id: string;
      roles: string[];
    };
    /** Resolved request language (set by the language middleware). */
    language: 'es' | 'en';
    /** Bound translator for response messages (set by the language middleware). */
    t: (key: string, messageParams?: Record<string, string | number>) => string;
  }
}
