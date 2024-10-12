// src/app/utils/utils.ts
import bcrypt from "bcryptjs"; // Use bcryptjs

// Function to hash a password using bcrypt
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}
