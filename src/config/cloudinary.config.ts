import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { envVars } from "./env";
import AppError from "../app/errorHelpers/AppError";
import status from "http-status";
import { error } from "console";
import { Result } from "pg";

cloudinary.config({
  cloud_name: envVars.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY_API_SECRET,
});

export const deleteImageFromCLoudinary = async (url: string) => {
  const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
  const match = url.match(regex);

  try {
    if (match && match[1]) {
      const public_id = match[1];
      await cloudinary.uploader.destroy(public_id, {
        resource_type: "image",
      });
      console.log(`File ${public_id} is deleted from the cloudinary`);
    }
  } catch (error: any) {
    throw new AppError(401, "cloudinary image not deleted", error.message);
  }
};

// manual upload code
export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  fileName: string,
): Promise<UploadApiResponse | undefined> => {
  if (!buffer || !fileName) {
    throw new AppError(
      status.BAD_REQUEST,
      "file biffer and file name are required",
    );
  }

  const extension = fileName.split(".").pop()?.toLowerCase();

  const fileNameWithoutExtension = fileName
    .split(".")
    .slice(0, -1)
    .join(".")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const uniqueName =
    Math.random().toString(36).substring(2) +
    "-" +
    Date.now() +
    "-" +
    fileNameWithoutExtension;

  const folder = extension === "pdf" ? "pdfs" : "images";

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `ph-healthcare/${folder}/${uniqueName}`,
        folder: `ph-healthcare/${folder}`,
      },
      (error, result) => {
        if (error) {
          throw new AppError(
            status.INTERNAL_SERVER_ERROR,
            "fiiled to upload file to Cloudinary",
          );
        }

        resolve(result as UploadApiResponse);
      },
    ).end(buffer);
  });
};

export const cloudinaryUpload = cloudinary;
