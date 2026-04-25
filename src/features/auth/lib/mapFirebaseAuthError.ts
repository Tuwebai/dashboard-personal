export function mapFirebaseAuthError(error: unknown, t: (key: string) => string) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/invalid-email':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return t('auth.invalidCredentials');
      case 'auth/email-already-in-use':
        return t('auth.emailInUse');
      case 'auth/weak-password':
        return t('auth.weakPassword');
      default:
        return t('auth.genericError');
    }
  }

  return t('auth.genericError');
}
