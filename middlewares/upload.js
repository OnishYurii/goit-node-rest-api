import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tmpDir = `${__dirname}/../tmp`;

const multerConfig = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cd) => {
    cd(null, file.originalname);
  },
});

export const upload = multer({
  storage: multerConfig,
});
