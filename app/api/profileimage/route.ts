import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { getUser } from "@/lib/auth";


import fs from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await getUser();

    if (!user?.email) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Image is required",
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
      "profile"
    );

    await fs.mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    const imageUrl = `/uploads/profile/${fileName}`;

    await prisma.user.update({
      where: {
        email: user?.email,
      },
      data: {
        image: imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      image: imageUrl,
      message: "Profile image uploaded successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}