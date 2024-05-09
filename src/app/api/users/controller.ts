import { sql } from "@vercel/postgres";
import { hashPassword } from "@/app/utils/utils";

export async function insertUser(
  adminId: string,
  sellerId: string,
  name: string,
  username: string,
  email: string,
  password: string,
  wallet: number,
  phone: string,
  pix: string,
  isComissionPercentual?: boolean,
  comissionValue?: number
) {
  //hash users password before storing in the database
  const hashedPassword = await hashPassword(password);

  //TODO: Add block to insert user in the credentials table

  //TODO: RETRIEVE THE ADMIN OR SELLER ID TO ADD TO TO THE USERS TABLE
  try {
    const insertCredentials = await sql`INSERT INTO credentials (username, email, password_hash)
    VALUES (${username}, ${email}, ${password})
    RETURNING user_id;
    `;

    const userId = insertCredentials.rows[0].user_id;
    // const insertUserOnUsersTable = await sql`
    // INSERT INTO users(user_id, name, email, wallet, phone, pix, seller_id, admin_id)
    // VALUES(${userId}, ${name}, ${email}, ${wallet}, ${phone}, ${pix}, ${sellerId}, ${adminId})
    // RETURNING *;`;

    //sql query to enter new user
    const insertUserOnUsersTable = await sql`
        INSERT INTO users (user_id, admin_id, seller_id, name, wallet, phone, pix, isComissionPercentual, comissionValue)
        VALUES (${userId}, ${adminId}, ${sellerId}, ${name}, ${wallet}, ${phone}, ${pix}, ${isComissionPercentual}, ${comissionValue})
        RETURNING user_id;
    `;

    return {
      insertCredentials: insertCredentials.rows[0],
      insertInUsersTable: insertUserOnUsersTable.rows[0],
      userId: insertUserOnUsersTable.rows[0].user_id,
    };
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
