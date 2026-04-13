import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { successResponse, unauthorizedResponse, errorResponse, validationErrorResponse } from "@/lib/api-response";

const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCOUNT_ID || "",
    secretAccessKey: process.env.R2_ACCOUNT_SECRET || "",
  },
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return unauthorizedResponse();
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return validationErrorResponse({ file: "No file provided" });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return errorResponse("Invalid file type. Only images are allowed.", "INVALID_FILE_TYPE", 400);
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return errorResponse("File too large. Maximum size is 5MB.", "FILE_TOO_LARGE", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `members/${session.user.id}/${Date.now()}.${ext}`;

    await R2.send(
      new PutObjectCommand({
        Bucket: "fitway",
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const publicUrl = `${process.env.R2_PUBLIC_URL || process.env.R2_ENDPOINT}/${fileName}`;

    return successResponse({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return errorResponse("Failed to upload file", "UPLOAD_ERROR", 500);
  }
}
