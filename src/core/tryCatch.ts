import { Result } from "./Result.d.ts";

export function tryCatch<T>(fn: () => Promise<Result<T>>): Promise<Result<T>> {
  try {
    return fn();
  } catch (error) {
    return Promise.resolve({
      ok: false,
      error: error.message || JSON.stringify(error),
    });
  }
}
