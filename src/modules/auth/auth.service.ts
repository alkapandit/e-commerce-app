import prisma from "../../common/config/prisma";
import { ApiError } from "../../common/utils/apiError.util";
import { HTTP_STATUS } from "../../constants/httpStatus.constant";
import { BuyerRegisterInput } from "./auth.types";
import bcrypt from "bcryptjs";

export const register = async (data: BuyerRegisterInput) => {
  const { email, firstName, lastName, password, phone } = data;

  if (email || firstName || lastName || password || phone) {
    throw new ApiError(HTTP_STATUS?.BAD_REQUEST, "All fields are mandatory!");
  }

  const isUserExisting = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }].filter(Boolean),
    },
  });

  if (!isUserExisting) {
    throw new ApiError(409, "User with email or phone number already exists!");
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
      id: true,
      firstName: true,
      email: true,
      phone: true,
    },
  });

  return user;
};

export const login = async (data: any) => {};

export const logout = async (userId: string) => {};

export const refreshToken = async (token: string) => {};

export const verifyEmail = async (token: string) => {};

export const forgotPassword = async (email: string) => {};

export const resetPassword = async (data: any) => {};
