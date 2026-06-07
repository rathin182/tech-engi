import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No file uploaded",
                },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(
            process.cwd(),
            "public",
            "uploads",
            "projectresources"
        );

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/projectresources/${fileName}`,
            fileName,
        });
    } catch (error) {
        console.error("Upload Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to upload file",
            },
            { status: 500 }
        );
    }
}