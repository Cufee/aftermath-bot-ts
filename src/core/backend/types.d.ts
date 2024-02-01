export type Response<T> =
  | {
    success: true;
    data: T;
  }
  | {
    success: false;
    data: null;
    error: {
      message: string;
      context?: string;
    };
  };
