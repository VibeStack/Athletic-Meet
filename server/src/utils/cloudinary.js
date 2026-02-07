import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

export const uploadImageOnCloudinary = async (
  folder = "landingPageImages",
  localFilePath
) => {
  if (!localFilePath) {
    throw new Error("❌ localFilePath is required");
  }

  const fileName = path.parse(localFilePath).name;
  const publicId = `${folder}/${fileName}`;

  return new Promise((resolve, reject) => {
    const fileReadStream = fs.createReadStream(localFilePath);
    fileReadStream.on("error", reject);

    const cloudinaryStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder,
        overwrite: false, // 🔒 DO NOT replace existing
        resource_type: "image",
        strip_metadata: true,
      },
      (error, result) => {
        // 🟢 Image already exists → ignore
        if (error?.http_code === 409) {
          return resolve({
            skipped: true,
            public_id: publicId,
          });
        }

        if (error) return reject(error);
        resolve({ skipped: false, ...result });
      }
    );

    pipeline(fileReadStream, cloudinaryStream).catch(reject);
  });
};
