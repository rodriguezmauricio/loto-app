const bcrypt = require("bcrypt");

// Function to hash a password using bcrypt
export async function hashPassword(password: string) {
  // Generate a salt to use during hashing
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  // Hash the password with the salt
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}
