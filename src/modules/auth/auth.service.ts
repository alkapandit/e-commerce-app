import bcrypt from "bcryptjs";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/token.util";
import prisma from "../../common/config/prisma";
import { ApiError } from "../../common/utils/apiError.util";
import { HTTP_STATUS } from "../../constants/httpStatus.constant";
import { BuyerLoginInput, BuyerRegisterInput } from "./auth.types";

export const register = async (data: BuyerRegisterInput) => {
  const { email, firstName, lastName, password, phone } = data;

  if (!email || !firstName || !lastName || !password || !phone) {
    throw new ApiError(HTTP_STATUS?.BAD_REQUEST, "All fields are mandatory!");
  }

  try {
    const isUserExisting = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }].filter(Boolean),
      },
    });

    if (isUserExisting) {
      throw new ApiError(
        409,
        "User with email or phone number already exists!",
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        passwordHash,
        role: "BUYER",
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    });

    return user;
  } catch (error) {
    console.error("Register Error:", error);

    throw new ApiError(500, "Failed to register user");
  }
};

export const login = async (data: BuyerLoginInput) => {
  const { identifier, password } = data;

  if (!identifier || !password) {
    throw new ApiError(400, "All fields are required!");
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!user) {
      throw new ApiError(404, "User does not exist!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credential!");
    }

    const accessToken = generateAccessToken(user?.id, user?.role);
    const refreshToken = generateRefreshToken(user?.id, user?.role);

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, "Error in generating refresh and access token!");
    }

    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashRefreshToken },
      }),
    ]);

    return {
      user: { email: user?.email, role: user?.role },
      accessToken,
      refreshToken,
    };
  } catch (error: any) {
    console.error("error in updating refresh token: ", error);
    throw new ApiError(500, "Failed to login user!");
  }
};

export const logout = async (userId: string) => {};

export const refreshToken = async (token: string) => {};

export const verifyEmail = async (token: string) => {};

export const forgotPassword = async (email: string) => {};

export const resetPassword = async (data: any) => {};
