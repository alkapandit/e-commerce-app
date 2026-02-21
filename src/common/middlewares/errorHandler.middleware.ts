import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError.util";
import { HTTP_STATUS } from "../../constants/httpStatus.constant";

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message: string = "Something went wrong!";
  let errors: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  }
  res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    errors,
  });
};
