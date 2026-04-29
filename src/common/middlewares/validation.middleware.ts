import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError.util";

export const validateBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Invalid request body!"));
  }
  next();
};

export const validateParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.params) {
    return next(new ApiError(400, "Invalid request param!"));
  }
  next();
};

export const validateQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.query) {
    return next(new ApiError(400, "Invalid request query!"));
  }
  next();
};
