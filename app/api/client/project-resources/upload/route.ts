import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/uploads";

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

        const fileUrl = await uploadFile(
            file,
            "projectresources"
        );

        return NextResponse.json({
            success: true,
            url: fileUrl,
            fileName: file.name,
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