import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export const hashValue = async (value: string) => {
  const saltRounds = 10;
  const hashedValue = await bcrypt.hash(value, saltRounds);
  return hashedValue;
};

export const compareHashValues = async (value: string, hashedValue: string) => {
  return await bcrypt.compare(value, hashedValue);
};

export const generateSecureToken = (bytes = 15) => {
  try {
    const buffer = randomBytes(bytes);
    return buffer.toString("base64url");
  } catch (err: any) {
    throw new Error("Failed to generate secure token: " + err.message);
  }
};