import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const getVerificationToken = () => {
  var token = crypto.randomBytes(32).toString("hex");
  return token;
};
export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  return hashPassword;
};

export const comparePassword = async (plainPass, hashPass) => {
  const verifyPassword = await bcrypt.compare(plainPass, hashPass);
  return verifyPassword;
};

export const createJwtToken = (data) => {
  const token = jwt.sign({ data }, config.JWT_SECRET_KEY);
  return token;
};

export const verifyJwtToken = (token) => {
  try {
    const result = jwt.verify(token, config.JWT_SECRET_KEY);
    return result;
  } catch (error) {
    return false;
  }
};
export function generateOTP(length) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}
