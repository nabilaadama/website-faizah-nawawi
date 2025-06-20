// // import { v2 as cloudinary } from "cloudinary";
// import { ImageRepository } from "@/core/interfaces/repositories/image-repository";

// const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
//   secure: true,
// });

// export class CloudinaryImageRepository implements ImageRepository {
//   async upload(file: File, folder: string): Promise<string> {
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     return new Promise((resolve, reject) => {
//       cloudinary.uploader
//         .upload_stream(
//           {
//             folder,
//             resource_type: "auto",
//           },
//           (error: any, result: any) => {
//             if (error) {
//               reject(error);
//             } else {
//               resolve(result!.secure_url);
//             }
//           }
//         )
//         .end(buffer);
//     });
//   }

//   async delete(publicId: string): Promise<void> {
//     await cloudinary.uploader.destroy(publicId);
//   }
// }

const cloudinary = require("cloudinary").v2;
import { ImageRepository } from "@/core/interfaces/repositories/image-repository";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryImageRepository implements ImageRepository {
  async upload(file: File, folder: string): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "auto",
          },
          (error: any, result: any) => {
            if (error) {
              reject(error);
            } else {
              resolve(result!.secure_url);
            }
          }
        )
        .end(buffer);
    });
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}