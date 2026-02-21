import { Response } from "express";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  errors?: unknown;
}

export const sendResponse = <T>(
  res: Response,
  success: boolean,
  message: string,
  statusCode: number,
  data?: T,
) => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    statusCode,
    data,
  };
  return res.status(statusCode).json(response);
};
