import { NextFunction } from "express";

// export const asyncHandler = (requestHandler: Function) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
//   };
// };

export const asyncHandler =
  (requestHandler: Function) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
