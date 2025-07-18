const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter to accept text or PDF files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['text/plain', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only text and PDF files are allowed'), false); //later photos will be allowed too...
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload.single('essay');