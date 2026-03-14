export type BuyerRegisterInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
};

export type BuyerLoginInput = {
  identifier: string;
  password: string;
};
