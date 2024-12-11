// src/app/api/users/[id]/uploadAvatar/route.ts

import { NextRequest, NextResponse } from "next/server";
import formidable from "formidable";
import fs from "fs";
import path from "path";

// Disable the default body parser (handled manually)
export const config = {
    runtime: "nodejs", // or 'edge' based on your requirements
};

export const POST = async (request: NextRequest) => {
    try {
        // Initialize formidable with desired options
        const form = formidable({ multiples: false });

        // Parse the incoming request
        const data = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
            (resolve, reject) => {
                form.parse(request, (err: any, fields: any, files: any) => {
                    if (err) reject(err);
                    else resolve({ fields, files });
                });
            }
        );

        const file = data.files.image as formidable.File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
        }

        // Define the upload directory
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Ensure the upload directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Move the uploaded file to the upload directory
        const filePath = path.join(uploadDir, file.originalFilename || "avatar");

        fs.renameSync(file.filepath, filePath);

        // Return the URL of the uploaded file
        const fileUrl = `/uploads/${file.originalFilename}`;

        return NextResponse.json({ url: fileUrl }, { status: 200 });
    } catch (error) {
        console.error("Error uploading avatar:", error);
        return NextResponse.json({ error: "Failed to upload avatar." }, { status: 500 });
    }
};
