/** English message catalog. Mirrors the key structure of the Spanish catalog. */
export const en = {
  auth: {
    register: { success: 'Account created successfully' },
    login: { success: 'Login successful' },
    token: { refreshed: 'Token refreshed' },
    logout: { success: 'Logged out successfully' },
    forgot: { success: 'If that email exists, a reset link has been sent' },
    reset: { success: 'Password updated successfully' },
    errors: {
      emailInUse: 'Email already in use',
      invalidCredentials: 'Invalid credentials',
      noRefreshToken: 'No refresh token provided',
      invalidRefreshToken: 'Invalid or expired refresh token',
      refreshRevoked: 'Invalid refresh token',
      invalidResetToken: 'Invalid or expired reset token',
      required: 'Authentication required',
      invalidToken: 'Invalid or expired token',
      insufficientPermissions: 'Insufficient permissions',
    },
  },
  users: {
    profile: { retrieved: 'Profile retrieved' },
    preferences: { updated: 'Preferences updated' },
    errors: { notFound: 'User not found' },
  },
  validation: { failed: 'Validation failed' },
  common: {
    duplicateField: '{{field}} already exists',
    invalidValue: 'Invalid value for {{path}}',
    routeNotFound: 'API route not found',
    internalError: 'Internal server error',
  },
} as const;
