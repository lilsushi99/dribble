import { isDbConnected, query } from '../config/database';
import { MediaItem } from '../types';

let memoryMedia: MediaItem[] = [];

export class MediaRepository {
  async findAll(): Promise<MediaItem[]> {
    if (isDbConnected()) {
      const sql = `SELECT * FROM media_library ORDER BY id DESC`;
      return query<MediaItem[]>(sql);
    }
    return memoryMedia;
  }

  async create(media: Omit<MediaItem, 'id' | 'created_at'>): Promise<MediaItem> {
    const now = new Date().toISOString();
    if (isDbConnected()) {
      const sql = `
        INSERT INTO media_library (filename, original_name, mime_type, file_size, file_path, category, uploaded_by, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      `;
      const res: any = await query(sql, [
        media.filename,
        media.original_name,
        media.mime_type,
        media.file_size,
        media.file_path,
        media.category || 'general',
        media.uploaded_by || null,
      ]);

      const insertedSql = `SELECT * FROM media_library WHERE id = ? LIMIT 1`;
      const rows = await query<MediaItem[]>(insertedSql, [res.insertId]);
      return rows[0];
    }

    const newItem: MediaItem = {
      ...media,
      id: memoryMedia.length + 1,
      created_at: now,
    };
    memoryMedia.push(newItem);
    return newItem;
  }

  async delete(id: number): Promise<boolean> {
    if (isDbConnected()) {
      const sql = `DELETE FROM media_library WHERE id = ?`;
      await query(sql, [id]);
      return true;
    }

    const len = memoryMedia.length;
    memoryMedia = memoryMedia.filter((m) => m.id !== id);
    return memoryMedia.length < len;
  }
}
