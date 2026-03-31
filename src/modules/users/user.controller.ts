import { Request, Response } from "express";
import * as UserService from "./user.service";
import { HTTP_STATUS } from "../../constants/httpStatus.constant";
import { sendResponse } from "../../common/utils/apiResponse.util";
import { asyncHandler } from "../../common/utils/asyncHandler.util";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await UserService.getUserById(req.body?.userId);
  sendResponse({
    res,
    data: user,
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "User fetched successfully",
  });
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await UserService.updateProfile(req.body?.userId, req.body);
    sendResponse({
      res,
      data: user,
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "Profile updated",
    });
  },
);
