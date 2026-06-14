import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { getApiError } from '@/api/errors.ts';

/**
 * Maps a normalized API error onto a react-hook-form: backend field errors land on
 * their fields, anything else on the form-level `root` error.
 */
export const applyApiError = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): void => {
  const { message, fieldErrors } = getApiError(error);

  if (fieldErrors) {
    for (const [field, messages] of Object.entries(fieldErrors)) {
      setError(field as Path<T>, { message: messages[0] });
    }
    return;
  }

  setError('root', { message });
};
