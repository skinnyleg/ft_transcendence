
import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';


const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

export const profilePicMulterOptions = {
  storage: diskStorage({
    destination: './uploads/avatar',
    filename: (req, file, callback) => {
      const name = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      callback(null, `${name}-${Date.now()}${fileExtName}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    const isValidExtension = allowedImageExtensions.includes(extname(file.originalname).toLowerCase());
    if (isValidExtension) {
      callback(null, true); // Accept the file
    } else {
      callback(new BadRequestException('Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.'), false);
    }
  },
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
  fileFilter: (req, file, callback) => {
    const isValidExtension = allowedImageExtensions.includes(extname(file.originalname).toLowerCase());
    if (isValidExtension) {
      callback(null, true); // Accept the file
    } else {
      callback(new BadRequestException('Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed.'), false);
    }
  },

};

