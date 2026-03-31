import prisma from "../../common/config/prisma";
import { ApiError } from "../../common/utils/apiError.util";
import { UpdateUserInput } from "./user.types";

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      isEmailVerified: true,
      isPhoneVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  return user;
};
export const updateProfile = async (id: string, data: UpdateUserInput) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const updatedUSer = await prisma.user.update({ where: { id }, data });

  return updatedUSer;
};
