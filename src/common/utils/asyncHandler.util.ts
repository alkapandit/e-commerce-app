import { NextFunction, RequestHandler } from "express";

// export const asyncHandler = (requestHandler: Function) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
//   };
// };

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
