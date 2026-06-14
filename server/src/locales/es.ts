/** Spanish message catalog (default language). */
export const es = {
  auth: {
    register: { success: 'Cuenta creada correctamente' },
    login: { success: 'Sesión iniciada' },
    token: { refreshed: 'Token actualizado' },
    logout: { success: 'Sesión cerrada' },
    forgot: { success: 'Si el correo existe, se envió un enlace para restablecer la contraseña' },
    reset: { success: 'Contraseña actualizada' },
    errors: {
      emailInUse: 'El correo ya está en uso',
      invalidCredentials: 'Credenciales inválidas',
      noRefreshToken: 'No se proporcionó token de actualización',
      invalidRefreshToken: 'Token de actualización inválido o expirado',
      refreshRevoked: 'Token de actualización inválido',
      invalidResetToken: 'Token de restablecimiento inválido o expirado',
      required: 'Autenticación requerida',
      invalidToken: 'Token inválido o expirado',
      insufficientPermissions: 'Permisos insuficientes',
    },
  },
  users: {
    profile: { retrieved: 'Perfil obtenido' },
    preferences: { updated: 'Preferencias actualizadas' },
    errors: { notFound: 'Usuario no encontrado' },
  },
  validation: { failed: 'La validación falló' },
  common: {
    duplicateField: 'El campo {{field}} ya existe',
    invalidValue: 'Valor inválido para {{path}}',
    routeNotFound: 'Ruta de API no encontrada',
    internalError: 'Error interno del servidor',
  },
} as const;
