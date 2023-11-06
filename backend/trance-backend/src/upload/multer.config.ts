
import { diskStorage } from 'multer';
import { extname } from 'path';

export const profilePicMulterOptions = {
  storage: diskStorage({
    destination: './uploads/avatar', // Set the destination folder
    filename: (req, file, callback) => {
      const name = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      callback(null, `${name}-${Date.now()}${fileExtName}`);
    },
  }),
};

export const backgroundPicMulterOptions = {
  storage: diskStorage({
    destination: './uploads/background', // Set the destination folder
    filename: (req, file, callback) => {
      const name = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      callback(null, `${name}-${Date.now()}${fileExtName}`);
    },
  }),
};

