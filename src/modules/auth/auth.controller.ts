import { Request, Response } from "express";
import { sendResponse } from "../../common/utils/apiResponse.util";
import { asyncHandler } from "../../common/utils/asyncHandler.util";
import { HTTP_STATUS } from "../../constants/httpStatus.constant";
import * as AuthService from "./auth.service";
import { ApiError } from "../../common/utils/apiError.util";

export const register = asyncHandler(async (req: Request, res: Response) => {
  if (!req?.body) {
    throw new ApiError(400, "Invalid request body!");
  }

  const user = await AuthService.register(req?.body);

  sendResponse({
    res,
    data: user,
    success: true,
    statusCode: HTTP_STATUS.CREATED,
    message: "User Registered Successfully.",
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  if (!req?.body) {
    throw new ApiError(400, "Invalid request body!");
  }

  const user = await AuthService.login(req?.body);

  const { accessToken, refreshToken } = user;
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse({
    res,
    data: user,
    success: true,
    statusCode: HTTP_STATUS.OK,
    message: "User loggedin successfully.",
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req?.body) {
      throw new ApiError(400, "Invalid request body!");
    }

    const token = await AuthService.refreshToken(req?.body);
    sendResponse({
      res,
      data: token,
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: "Token refreshed successfully.",
    });
  },
);

export const verifyEmail = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const verifyPhone = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {},
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {},
);
