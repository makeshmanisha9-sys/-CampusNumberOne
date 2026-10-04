import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow images, pdfs, docs, zip
  const allowedExts = /jpeg|jpg|png|webp|gif|pdf|doc|docx|ppt|pptx|xls|xlsx|zip|txt/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowedExts.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File format .${ext} is not supported. Allowed formats: images, pdf, docs, archives.`), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max limit
  fileFilter: fileFilter,
});
