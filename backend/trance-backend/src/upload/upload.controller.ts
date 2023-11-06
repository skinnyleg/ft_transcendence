import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, Req, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { backgroundPicMulterOptions, profilePicMulterOptions } from './multer.config';
import * as path from 'path';
import { Response } from 'express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}


  @Post('ProfilePic')
  @UseInterceptors(FileInterceptor('file', profilePicMulterOptions))
  async uploadProfilePic(@UploadedFile() file: Express.Multer.File, @Req() req) {


    // Handle the uploaded file, e.g., save the file details to the database
		// console.log("file == ", file)
	const idString = req.cookies.id
	const id = parseInt(idString, 10)
	if (isNaN(id))
		throw new BadRequestException('id not valid number')

	const newDir =  'http://localhost:8000/' + 'upload/Profile/'
	const filePath = newDir + file.filename
	// console.log("new path == ", filePath)
	await this.uploadService.updateProfilePic(filePath, id)
    return { valid:true, filename: filePath };
  }

  @Post('BackgroundPic')
  @UseInterceptors(FileInterceptor('file', backgroundPicMulterOptions))
  async uploadBackgroundPic(@UploadedFile() file: Express.Multer.File, @Req() req) {


    // Handle the uploaded file, e.g., save the file details to the database
		// console.log("file == ", file)
	const idString = req.cookies.id
	const id = parseInt(idString, 10)
	if (isNaN(id))
		throw new BadRequestException('id not valid number')
	const newDir =  'http://localhost:8000/' + 'upload/background/'
	const filePath = newDir + file.filename
	// console.log("new path == ", filePath)
	await this.uploadService.updateBackgroundPic(filePath, id)
    return { valid:true, filename: filePath };
  }


	@Get('/profile:filename')
	serveProfilePic(@Param('filename') filename: string, @Res() res: Response) {
    // Serve files from the 'uploads' directory
			// console.log("getting image")
		const newDir =  path.join(__dirname, '..', '..', 'uploads', 'avatar')
    	res.sendFile(filename, { root: newDir });
	}

	@Get('/background:filename')
	serveBackgroundPic(@Param('filename') filename: string, @Res() res: Response) {
    // Serve files from the 'uploads' directory
			// console.log("getting image")
		const newDir =  path.join(__dirname, '..', '..', 'uploads', 'background')
    	res.sendFile(filename, { root: newDir });
	}
}
