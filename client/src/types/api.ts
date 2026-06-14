/** Envelope returned by every API endpoint. */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]> | null;
}
