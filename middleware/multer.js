//for image processing
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    let newfilename = new Date().toISOString() + file.originalname;
    cb(null, file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  // console.log(file.originalname);

  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}

const upload = multer({
  storage : storage,
  fileFilter : fileFilter
});

module.exports = upload;