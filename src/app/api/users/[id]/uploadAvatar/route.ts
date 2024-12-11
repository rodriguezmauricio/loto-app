// src/app/api/users/[id]/upload-avatar/route.ts

import { NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@lib/authOptions";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disable Next.js default body parsing to handle file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request: Request, { params }: { params: { id: string } }) {
    try {
        // Authenticate the user using getServerSession
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Extract user information from session
        const userRole = session.user.role as string;
        const currentUserId = session.user.id as string;

        // Authorization: Only admins or the user themselves can upload avatar
        if (userRole !== "admin" && params.id !== currentUserId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Parse the incoming form data
        const form = new formidable.IncomingForm();
        form.uploadDir = path.join(process.cwd(), "/public/uploads");
        form.keepExtensions = true;

        // Ensure the upload directory exists
        if (!fs.existsSync(form.uploadDir)) {
            fs.mkdirSync(form.uploadDir, { recursive: true });
        }

        const data = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
            (resolve, reject) => {
                form.parse(request, (err, fields, files) => {
                    if (err) reject(err);
                    resolve({ fields, files });
                });
            }
        );

        const file = data.files.image as formidable.File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
        }

        // Validate file type (e.g., only allow images)
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!allowedTypes.includes(file.mimetype || "")) {
            fs.unlinkSync(file.filepath); // Remove the uploaded file
            return NextResponse.json({ error: "Invalid file type." }, { status: 400 });
        }

        // Validate file size (e.g., max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            fs.unlinkSync(file.filepath); // Remove the uploaded file
            return NextResponse.json({ error: "File is too large." }, { status: 400 });
        }

        // Move the file to the desired location
        const fileName = `avatar_${params.id}_${Date.now()}${path.extname(
            file.originalFilename || ""
        )}`;
        const newPath = path.join(form.uploadDir, fileName);

        fs.renameSync(file.filepath, newPath);

        // Update the user's image URL in the database
        const imageUrl = `/uploads/${fileName}`;

        const updatedUser = await prisma.user.update({
            where: { id: params.id },
            data: { image: imageUrl },
            select: {
                id: true,
                username: true,
                image: true,
            },
        });

        return NextResponse.json({ imageUrl: updatedUser.image }, { status: 200 });
    } catch (error: any) {
        console.error("Error uploading avatar:", error);
        return NextResponse.json({ error: "Error uploading avatar." }, { status: 500 });
    }
}
