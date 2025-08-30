import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { isSessionValid } from "@/lib/auth/validateSession";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  // Check session
  const sessionCookie = req.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("session="))
    ?.split("=")[1];

  console.log("Raw session cookie value:", sessionCookie);

  if (!isSessionValid(sessionCookie)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  if (file.size > 2 * 1024 * 1024)
    return NextResponse.json({ error: "File too large" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "profile_pics", resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            if (!result || !result.secure_url)
              return reject(new Error("No secure_url from Cloudinary"));
            resolve({ secure_url: result.secure_url });
          }
        );
        uploadStream.end(buffer);
      }
    );

    // Update the only user
    await prisma.user.updateMany({
      data: { profilePhoto: result.secure_url },
    });

    return NextResponse.json({ success: true, url: result.secure_url });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
