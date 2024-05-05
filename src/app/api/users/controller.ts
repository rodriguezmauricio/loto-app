import { sql } from "@vercel/postgres";
import { hashPassword } from "@/app/utils/utils";

export async function insertUser(name: string, email: string, password: string) {
  //hash users password before storing in the database
  const hashedPassword = await hashPassword(password);

  try {
    //sql query to enter new user
    const result = await sql`
    INSERT INTO users(name, email, password)
    VALUES(${name}, ${email}, ${hashedPassword})
    RETURNING *;`;

    return result.rows[0];
  } catch (error) {
    console.error("Error inserting user: ", error);
    throw error;
  }
}

export async function getUserById(userId: string) {
  try {
    //sql query to find user by id
    const result = await sql`
    SELECT * FROM users WHERE user_id = ${userId}`;

    // return user data
    return result.rows[0];
  } catch (error) {
    console.error("Error finding user: ", error);
    throw error;
  }
}

export async function updateUser(userId: string, newData: { name?: string; email?: string }) {
  const { name, email } = newData;

  try {
    //sql to update user data in database
    const result = await sql`
    UPDATE user
    SET name = ${name}, email = ${email}
    WHERE user_id = ${userId}
    RETURNING *;`;

    //return updated user data
    return result.rows[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {
    //sql to delete user
    await sql`
    DELETE FROM user WHERE user_id = ${userId};`;
  } catch (error) {
    console.error("Error updating user: ", error);
    throw error;
  }
}
