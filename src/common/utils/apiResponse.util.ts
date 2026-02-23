import type { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: unknown;
}

interface SendResponseParams<T> {
  res: Response;
  statusCode: number;
  message: string;
  data?: T;
  success?: boolean;
}

export const sendResponse = <T>({
  res,
  statusCode,
  message,
  data,
  success = true,
}: SendResponseParams<T>) => {
  const response: ApiResponse<T> = {
    success,
    statusCode,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};
