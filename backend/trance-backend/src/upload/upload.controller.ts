import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, Req, BadRequestException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { backgroundPicMulterOptions, profilePicMulterOptions } from './multer.config';
import * as path from 'path';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { getId } from 'src/utils/getId';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}


  @UseGuards(JwtAuthGuard)
  @Post('ProfilePic')
  @UseInterceptors(FileInterceptor('file', profilePicMulterOptions))
  async uploadProfilePic(@UploadedFile() file: Express.Multer.File, @Req() req) {

	if (file === undefined)
		throw new BadRequestException('Server doesn\'t this upload')
	const id = getId(req);
	const newDir =  'http://localhost:8000/' + 'upload/profile/'
	const filePath = newDir + file.filename
	await this.uploadService.updateProfilePic(filePath, id)
    return { valid:true, filename: filePath };
  }

  @UseGuards(JwtAuthGuard)
  @Post('BackgroundPic')
  @UseInterceptors(FileInterceptor('file', backgroundPicMulterOptions))
  async uploadBackgroundPic(@UploadedFile() file: Express.Multer.File, @Req() req) {

	if (file === undefined)
		throw new BadRequestException('Server doesn\'t this upload')
	const id = getId(req);
	const newDir =  'http://localhost:8000/' + 'upload/background/'
	const filePath = newDir + file.filename
	await this.uploadService.updateBackgroundPic(filePath, id)
    return { valid:true, filename: filePath };
  }


	@UseGuards(JwtAuthGuard)
	@Get('/profile/:filename')
	serveProfilePic(@Param('filename') filename: string, @Res() res: Response) {
		const newDir =  path.join(__dirname, '..', '..', 'uploads', 'avatar')
    	res.sendFile(filename, { root: newDir });
	}
	
	@UseGuards(JwtAuthGuard)
	@Get('/background/:filename')
	serveBackgroundPic(@Param('filename') filename: string, @Res() res: Response) {
		console.log("ddddddd")
		const newDir =  path.join(__dirname, '..', '..', 'uploads', 'background')
    	res.sendFile(filename, { root: newDir });
	}
}
