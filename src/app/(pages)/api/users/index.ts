// pages/api/users/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import { insertUser, deleteUser, updateUser, getUserById } from "@/app/api/users/controller"; // Adjust the path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const {
        adminId,
        sellerId,
        name,
        username,
        email,
        password,
        wallet,
        pix,
        isComissionPercentual,
        comissionValue,
      } = req.body;

      const newUser = await insertUser(
        adminId,
        sellerId,
        name,
        username,
        email,
        password,
        wallet,
        pix,
        isComissionPercentual,
        comissionValue
      );

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "GET") {
    try {
      const userId = req.query.id as string;
      const user = await getUserById(userId);

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found." });
      }
    } catch (error) {
      console.error("Error fetching user: ", error);
      res.status(500).json({ error: "Failed to fetch user." });
    }
  } else if (req.method === "PUT") {
    try {
      const userId = req.query.id as string;
      const { name, email } = req.body;

      const updatedUser = await updateUser(userId, { name, email });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user: ", error);
      res.status(500).json({ error: "Failed to update user." });
    }
  } else if (req.method === "DELETE") {
    try {
      const userId = req.query.id as string;
      await deleteUser(userId);
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting user: ", error);
      res.status(500).json({ error: "Failed to delete user." });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
