import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode: number;
  timestamp: string;
}

export function sendSuccess<T = any>(
  res: Response,
  data: T,
  message = 'Operation successful',
  statusCode = 200
): Response {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    statusCode,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  message = 'An error occurred',
  statusCode = 500,
  errorDetails?: any
): Response {
  const payload: ApiResponse = {
    success: false,
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
  };
  if (process.env.NODE_ENV !== 'production' && errorDetails) {
    (payload as any).details = errorDetails;
  }
  return res.status(statusCode).json(payload);
}
