import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { uploadFile } from "@/lib/uploads";

export async function POST(req: NextRequest) {
  try {
    const { user } = await getUser();

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

    const imageUrl = await uploadFile(
      file,
      "profile"
    );

    await prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        image: imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      image: imageUrl,
      message:
        "Profile image uploaded successfully",
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