const path = require('path');
const multer = require('multer');

const uploadDir = path.join(__dirname, '../public/uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'immobile-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });
module.exports = upload;
