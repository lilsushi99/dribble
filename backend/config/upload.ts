import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Root directory where uploaded files are physically stored. Defaults to <app>/uploads
// (the previous hardcoded behavior) but can be pointed at a persistent path outside the
// deployed code directory via the UPLOAD_DIR env var — important on platforms like
// Hostinger's Git-based Node.js deploy, where the deployed directory itself is reset to
// match the git tree on every push/redeploy, wiping anything not tracked in git
// (uploaded files are intentionally never committed to git).
export const UPLOAD_ROOT = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), 'uploads');

// Ensure upload directories exist
const uploadDirs = ['logos', 'projects', 'blog', 'studio', 'comic-panels', 'general'];

uploadDirs.forEach((dir) => {
  const fullPath = path.join(UPLOAD_ROOT, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Single source of truth for category -> physical folder mapping. Used by BOTH the
// multer storage engine (to decide where to physically write the file) and the media
// service (to decide what path to store in the DB), so the two can never drift apart.
export function resolveUploadFolder(rawCategory: string | undefined): string {
  const category = (rawCategory || 'general').toLowerCase();
  if (category.includes('logo')) return 'logos';
  if (category.includes('project')) return 'projects';
  if (category.includes('blog')) return 'blog';
  if (category.includes('studio')) return 'studio';
  if (category.includes('comic')) return 'comic-panels';
  return 'general';
}

export interface UploadRequest extends Request {
  resolvedUploadFolder?: string;
}

// Storage engine definition
const storage = multer.diskStorage({
  destination: (req: UploadRequest, file, cb) => {
    // NOTE: req.body.category is only reliably populated here if the 'category' field
    // was sent BEFORE the 'file' field in the multipart form (multer/busboy parses the
    // stream in order, and this callback fires as soon as the file part is reached).
    // adminApi.uploadMedia() on the frontend appends 'category' first specifically so
    // this works. If a future caller sends the file first, this will fall back to
    // 'general' rather than silently mis-filing the upload.
    const folder = resolveUploadFolder(req.body?.category);
    req.resolvedUploadFolder = folder;
    cb(null, path.join(UPLOAD_ROOT, folder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const nameWithoutExt = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${nameWithoutExt}_${uniqueSuffix}${ext}`);
  },
});

// File filter validator for allowed images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp|svg\+xml|svg/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only PNG, JPG, JPEG, WEBP, and SVG image files are allowed.'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});
