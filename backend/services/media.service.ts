import { MediaRepository } from '../repositories/media.repository';
import { resolveUploadFolder } from '../config/upload';
import fs from 'fs';
import path from 'path';

export class MediaService {
  private mediaRepo = new MediaRepository();

  async getAllMedia() {
    return this.mediaRepo.findAll();
  }

  async saveMediaRecord(
    file: Express.Multer.File,
    category = 'general',
    userId?: number,
    actualFolder?: string
  ) {
    // Use the folder the file was actually written to when available (set by the
    // multer storage engine) so the DB path can never point somewhere the file isn't.
    const folder = actualFolder || resolveUploadFolder(category);
    const relativePath = `/uploads/${folder}/${file.filename}`;
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
