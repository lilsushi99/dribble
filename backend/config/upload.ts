import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const uploadDirs = [
  'uploads/logos',
  'uploads/projects',
  'uploads/blog',
  'uploads/studio',
  'uploads/comic-panels',
  'uploads/general',
];

uploadDirs.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Storage engine definition
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const category = (req.body.category || 'general').toLowerCase();
    let targetFolder = 'uploads/general';

    if (category.includes('logo')) targetFolder = 'uploads/logos';
    else if (category.includes('project')) targetFolder = 'uploads/projects';
    else if (category.includes('blog')) targetFolder = 'uploads/blog';
    else if (category.includes('studio')) targetFolder = 'uploads/studio';
    else if (category.includes('comic')) targetFolder = 'uploads/comic-panels';

    cb(null, path.join(process.cwd(), targetFolder));
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
