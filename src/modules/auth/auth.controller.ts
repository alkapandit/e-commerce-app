import { Request, Response } from "express";
import { sendResponse } from "../../common/utils/apiResponse.util";
import { asyncHandler } from "../../common/utils/asyncHandler.util";
import { HTTP_STATUS } from "../../constants/httpStatus.constant";
import * as AuthService from "./auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.register(req.body);
  sendResponse({
    res,
    data: user,
    success: true,
    statusCode: 201,
    message: "User Registered Successfully!",
  });
});
