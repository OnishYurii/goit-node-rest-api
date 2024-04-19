import multer from "multer";
import path from "path";

const tmpDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cd) => {
    cd(null, file.originalname);
  },
});

export const upload = multer({
  storage: multerConfig,
});
