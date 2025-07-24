const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const path = require('path');

// Set up memory storage for multer to store the file in memory
const storage = multer.memoryStorage();

// Set up the multer middleware for handling file uploads
const upload = multer({
  storage: storage,
  limits: {
     fileSize: 10 * 1024 * 1024,

   }, // 10MB file size limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Error: Images Only! (jpeg, jpg, png, gif, webp)'));
    }
  }
}).single('avatar');

module.exports = upload;
