export interface AsyncData<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function createInitialAsyncData<T>(): AsyncData<T> {
  return {
    data: null,
    isLoading: false,
    error: null
  };
}

export function createLoadingAsyncData<T>(existingData?: T | null): AsyncData<T> {
  return {
    data: existingData ?? null,
    isLoading: true,
    error: null
  };
}

export function createErrorAsyncData<T>(error: string, existingData?: T | null): AsyncData<T> {
  return {
    data: existingData ?? null,
    isLoading: false,
    error
  };
}

export function createSuccessAsyncData<T>(data: T): AsyncData<T> {
  return {
    data,
    isLoading: false,
    error: null
  };
}
