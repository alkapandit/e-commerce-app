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
  LoginInput,
  RegisterInput,
  RefreshAccessTokenInput,
} from "./auth.types";

export const register = async (data: RegisterInput) => {
  const { email, firstName, lastName, password, phone, userType } = data;

  if (!email || !firstName || !lastName || !password || !phone || !userType) {
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
        role: userType?.toLocaleLowerCase() === "seller" ? "SELLER" : "BUYER",
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

export const login = async (data: LoginInput) => {
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

export const sendEmailOtp = async (token: string) => {};

export const verifyEmailOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user?.emailOtp !== otp) {
    throw new ApiError(400, "Invalid OTP!");
  }
  if (!user?.otpExpiry || user?.otpExpiry < new Date()) {
    throw new ApiError(400, "OTP Expired!");
  }

  const result = await prisma.user.update({
    where: { email },
    data: {
      isEmailVerified: true,
      emailOtp: null,
      otpExpiry: null,
    },
  });

  return result;
};

export const sendPhoneOtp = async (token: string) => {};

export const verifyPhoneOtp = async (phone: string, otp: string) => {
  const user = await prisma.user.findFirst({ where: { phone } });

  if (!user || user?.phoneOtp !== otp) {
    throw new ApiError(400, "Invalid OTP!");
  }
  if (!user?.otpExpiry || user?.otpExpiry < new Date()) {
    throw new ApiError(400, "OTP Expired!");
  }

  const result = await prisma.user.update({
    where: { id: user?.id },
    data: {
      isEmailVerified: true,
      phoneOtp: null,
      otpExpiry: null,
    },
  });

  return result;
};

export const forgotPassword = async (id: string, data: any) => {};

export const resetPassword = async (id: string, data: any) => {};
