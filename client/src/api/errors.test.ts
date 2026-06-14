import { describe, it, expect } from 'vitest';
import { AxiosError, type AxiosResponse } from 'axios';
import { getApiError } from './errors.ts';

describe('getApiError', () => {
  it('reads status, message and fieldErrors from an AxiosError response', () => {
    const error = new AxiosError('Request failed');
    error.response = {
      status: 422,
      data: {
        success: false,
        message: 'Validation failed',
        data: null,
        errors: { email: ['Invalid email'] },
      },
    } as unknown as AxiosResponse;

    const result = getApiError(error);

    expect(result.status).toBe(422);
    expect(result.message).toBe('Validation failed');
    expect(result.fieldErrors).toEqual({ email: ['Invalid email'] });
  });

  it('falls back to the Axios message when the response has no body', () => {
    const result = getApiError(new AxiosError('Network Error'));

    expect(result.status).toBeNull();
    expect(result.message).toBe('Network Error');
    expect(result.fieldErrors).toBeNull();
  });

  it('handles non-Axios errors with a generic shape', () => {
    const result = getApiError(new Error('boom'));

    expect(result.status).toBeNull();
    expect(result.message).toBe('boom');
    expect(result.fieldErrors).toBeNull();
  });
});
