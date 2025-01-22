// PS-IMS-Backend-main/config/multerConfig.js
const multer = require('multer');

// 1) Use memory storage so the file is never written locally:
const storage = multer.memoryStorage();

// 2) Create the Multer upload instance:
const upload = multer({ storage });

module.exports = upload;
