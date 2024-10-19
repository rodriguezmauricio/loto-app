// src/app/utils/utils.ts
import bcrypt from "bcryptjs"; // Use bcryptjs

// Function to hash a password using bcrypt
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt
    return hashedPassword;
}
