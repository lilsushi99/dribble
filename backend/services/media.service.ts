import { MediaRepository } from '../repositories/media.repository';
import fs from 'fs';
import path from 'path';

export class MediaService {
  private mediaRepo = new MediaRepository();

  async getAllMedia() {
    return this.mediaRepo.findAll();
  }

  async saveMediaRecord(file: Express.Multer.File, category = 'general', userId?: number) {
    const relativePath = `/uploads/${category}/${file.filename}`;
    return this.mediaRepo.create({
      filename: file.filename,
      original_name: file.originalname,
      mime_type: file.mimetype,
      file_size: file.size,
      file_path: relativePath,
      category,
      uploaded_by: userId,
    });
  }

  async deleteMedia(id: number) {
    return this.mediaRepo.delete(id);
  }
}
