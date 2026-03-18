import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/token.util";
import prisma from "../../common/config/prisma";
import { ApiError } from "../../common/utils/apiError.util";
import { HTTP_STATUS } from "../../constants/httpStatus.constant";
import {
  BuyerLoginInput,
  BuyerRegisterInput,
  RefreshAccessTokenInput,
} from "./auth.types";

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

  const identifierTrimmed = identifier?.trim();

  if (!identifierTrimmed || !password) {
    throw new ApiError(400, "All fields are required!");
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: identifierTrimmed, mode: "insensitive" } },
          { phone: identifierTrimmed },
        ],
      },
    });

    if (!user) {
      throw new ApiError(404, "User does not exist!");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credential!");
    }

    const accessToken = generateAccessToken(user?.id);
    const refreshToken = generateRefreshToken(user?.id);

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

    if (error instanceof ApiError) {
      throw error; // ✅ preserve real error
    }

    throw new ApiError(500, "Failed to login user!");
  }
};

export const logout = async (userId: string) => {};

export const refreshToken = async (data: RefreshAccessTokenInput) => {
  const { refreshToken } = data;
  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required!");
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as { userId: string };

    const newAccessToken = generateAccessToken(decoded?.userId);

    return newAccessToken;
  } catch (error) {
    console.error("Error in refreshing access token!");
    throw new ApiError(500, "Falied to refresh token!");
  }
};

export const verifyEmail = async (token: string) => {};

export const forgotPassword = async (email: string) => {};

export const resetPassword = async (data: any) => {};
