export const config = {
  BASE_URL: process.env.REACT_APP_BASE_URL,
  parcelStatus: {
    1: "created",
    2: "in-transit",
    3: "received",
    4: "claimed",
    5: "delivered",
    6: "void",
    7: "modified",
  },
  voidType: {
    1: "void",
    2: "modified",
  },
  voidStatus: {
    1: "approved",
    2: "pending",
    3: "rejected",
  },
  role: {
    staff: 1,
    "staff-admin": 2,
  },
  cargoType: {
    1: "cargo",
    2: "accompanied",
  },
  ticket: {
    totalCopy: 6,
  },
  header: {
    deviceId: "1",
    deviceType: "3",
  },
  version: {
    environment: "",
    build: "1.8.0(187)",
  },
  environment: "",
  changeLogs: `feature/busNo-disabled-for-cargo-enabled-for-acco/build187`,
};

export const ERROR_CODES = {
  7002: {
    module: "LOGIN",
    code: "DELIVERY_PERSON_NOT_FOUND",
    message: "Login Failed",
    description: "username or password is not correct",
  },
  1003: {
    module: "LOGIN",
    code: "PASSWORD_MISMATCH",
    message: "Login Failed",
    description: "username or password is not correct",
  },
  1000: {
    module: "MANIFEST",
    code: "SESSION_NOT_FOUND",
    message: "Session Expired",
    description: "Please logout your account and login again.",
  },
  403: {
    module: "PARCEL",
    code: "PARCEL_PRICE_CONFIG_NOT_FOUND",
    message: "Bus Configuration Error",
    description:
      "No configuration found. Please contact Movon technical support!",
  },
  7003: {
    module: "PARCEL",
    code: "PARCEL_PRICE_CONFIG_NOT_FOUND",
    message: "Bus Configuration Error",
    description:
      "No configuration found. Please contact Movon technical support!",
  },
  4012: {
    module: "PARCEL",
    code: "PARCEL_PRICE_CONFIG_NOT_FOUND",
    message: "BL Number Exist",
    description: "Please replace your bill of lading number and continue.",
  },
  2604: {
    module: "EDIT",
    code: "USER_NAME_EXIST",
    message: "Username has already been taken",
    description: "Please choose another username.",
  },
  2605: {
    module: "EDIT",
    code: "SAME_OLD_PASSWORD",
    message: "Same Old Password",
    description: "New password cannot be the same as your old password",
  },
  2606: {
    module: "EDIT",
    code: "INCORRECT_OLD_PASSWORD",
    message: "Incorrect Password",
    description: "Old password mismatch",
  },
};
