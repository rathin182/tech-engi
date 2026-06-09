import { NextResponse } from "next/server";
import sendEmail from "@/lib/email";
// import prisma from "@/lib/prisma"; // uncomment if you're using Prisma

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        /*
        =====================================
        SAVE TO DATABASE (OPTIONAL)
        =====================================
        */
        // await prisma.subscription.create({
        //   data: { email },
        // });

        /*
        =====================================
        SEND WELCOME EMAIL
        =====================================
        */
        const emailSent = await sendEmail(
            email,
            "Welcome to TECH ENGI 🚀 – Let’s Build Something Great Together",
            `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border: 1px solid #e5e7eb; border-radius: 10px;">

      <div style="text-align: center; padding-bottom: 10px;">
        <h1 style="color: #dc2626; margin: 0;">TECH ENGI</h1>
        <p style="color: #6b7280; margin-top: 5px;">Connecting Clients with Skilled Engineers</p>
      </div>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

      <h2 style="color: #111827;">Welcome aboard 🎉</h2>

      <p style="color: #374151; font-size: 15px; line-height: 1.6;">
        Hi there,
      </p>

      <p style="color: #374151; font-size: 15px; line-height: 1.6;">
        Thank you for joining <strong>TECH ENGI</strong> — a trusted platform where
        <strong>clients post their project requirements</strong> and
        <strong>verified engineers connect, collaborate, and deliver solutions</strong>.
      </p>

      <p style="color: #374151; font-size: 15px; line-height: 1.6;">
        Whether you're looking to hire talent or showcase your engineering expertise,
        we help you find the perfect match based on skills, experience, and project needs.
      </p>

      <div style="text-align: center; margin: 25px 0;">
        <a href="https://your-domain.com/dashboard"
           style="background: #dc2626; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
          Get Started
        </a>
      </div>

      <p style="color: #374151; font-size: 14px;">
        You can now explore projects, connect with engineers, or post your own requirements.
      </p>

      <p style="margin-top: 25px; color: #111827;">
        Best regards,<br/>
        <strong>Team TECH ENGI</strong>
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />

      <p style="font-size: 12px; color: #9ca3af; text-align: center;">
        © ${new Date().getFullYear()} TECH ENGI. All rights reserved.
      </p>

    </div>
  `
        );

        return NextResponse.json({
            success: true,
            message: "Subscribed successfully",
            emailSent,
        });
    } catch (error) {
        console.error("Subscription error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
            },
            { status: 500 }
        );
    }
}