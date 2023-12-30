import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, Req, BadRequestException, UseGuards, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { backgroundPicMulterOptions, channelPicMulterOptions, profilePicMulterOptions } from './multer.config';
import * as path from 'path';
import * as fs from 'fs';
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
  @Post('ChannelPic')
  @UseInterceptors(FileInterceptor('file', channelPicMulterOptions))
  async uploadChannelPic(@UploadedFile() file: Express.Multer.File, @Req() req) {

	console.log('entered upload channel')
	if (file === undefined)
		throw new BadRequestException('Server doesn\'t this upload')
	const id = getId(req);
	const channelName = req.headers.channelname;
	if (channelName === undefined || channelName === '')
		throw new BadRequestException('No Channel Name Given')
	const newDir =  'http://localhost:8000/' + 'upload/channel/'
	const filePath = newDir + file.filename
	await this.uploadService.updateChannelPic(filePath, channelName)
    return { valid:true, filename: filePath };
  }


	@UseGuards(JwtAuthGuard)
	@Get('/profile/:filename')
	serveProfilePic(@Param('filename') filename: string, @Res() res: Response) {
		try {
			const newDir = path.join(__dirname, '..', '..', 'uploads', 'avatar');
			const filePath = path.join(newDir, filename);
			if (fs.existsSync(filePath)) {
			res.sendFile(filename, { root: newDir });
			} else {
			// Return a 404 Not Found response if the file does not exist
			throw new NotFoundException('File not found');
			}
		} catch (error) {
			// Handle other errors (e.g., server error)
			// console.error(error);
			res.status(500).send('Internal Server Error');
		}
	}
	
	@UseGuards(JwtAuthGuard)
	@Get('/background/:filename')
	serveBackgroundPic(@Param('filename') filename: string, @Res() res: Response) {
		try {
			const newDir = path.join(__dirname, '..', '..', 'uploads', 'background');
			const filePath = path.join(newDir, filename);
			if (fs.existsSync(filePath)) {
			res.sendFile(filename, { root: newDir });
			} else {
			// Return a 404 Not Found response if the file does not exist
			throw new NotFoundException('File not found');
			}
		} catch (error) {
			// Handle other errors (e.g., server error)
			// console.error(error);
			res.status(500).send('Internal Server Error');
		}
	}

	@UseGuards(JwtAuthGuard)
	@Get('/channel/:filename')
	serveChannelPic(@Param('filename') filename: string, @Res() res: Response) {
		try {
			const newDir = path.join(__dirname, '..', '..', 'uploads', 'channels');
			const filePath = path.join(newDir, filename);
			if (fs.existsSync(filePath)) {
			res.sendFile(filename, { root: newDir });
			} else {
			// Return a 404 Not Found response if the file does not exist
			throw new NotFoundException('File not found');
			}
		} catch (error) {
			// Handle other errors (e.g., server error)
			// console.error(error);
			res.status(500).send('Internal Server Error');
		}
	}
}
