// server/src/middlewares/multer.middleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Use absolute path for robustness
const tempDir = path.resolve("public/temp");

// ✅ Ensure folder exists
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// ✅ Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, tempDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

// ✅ File filter (only images allowed)
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extValid = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowed.test(file.mimetype);

  if (extValid && mimeValid) cb(null, true);
  else cb(new Error("Only image files allowed (jpeg, jpg, png, webp)"), false);
};

// ✅ Export configured multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB per file
});
