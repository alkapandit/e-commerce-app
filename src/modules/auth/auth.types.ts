export type RegisterInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  userType: string;
};

export type LoginInput = {
  identifier: string;
  password: string;
};

export type RefreshAccessTokenInput = {
  refreshToken: string;
};
