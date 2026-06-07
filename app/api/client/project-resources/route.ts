import { NextRequest, NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const { user, error } = await getUser();
        
        if (!user?.clientProfile?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized",}, { status: 401 });
        }

        const formData = await req.formData();

        const projectId = formData.get("projectId")?.toString();
        const title = formData.get("title")?.toString();
        const type = formData.get("type")?.toString();
        const content = formData.get("content")?.toString();
        const isLocked =
            formData.get("isLocked")?.toString() === "true";

        if (!projectId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Project is required",
                },
                { status: 400 }
            );
        }

        if (!title) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title is required",
                },
                { status: 400 }
            );
        }

        if (!type) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Type is required",
                },
                { status: 400 }
            );
        }

        if (!content) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Content is required",
                },
                { status: 400 }
            );
        }

        const resource = await prisma.projectResource.create({
            data: {
                projectId,
                addedById: user?.id || "",
                title,
                type: type as any,
                content,
                isLocked,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Resource created successfully",
            resource,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}