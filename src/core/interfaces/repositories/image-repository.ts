export interface ImageRepository {
  upload(file: File, folder: string): Promise<string>;
  delete(publicId: string): Promise<void>;
}
