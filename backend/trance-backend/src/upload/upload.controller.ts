import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, Req, BadRequestException, UseGuards, Delete, ConflictException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { backgroundPicMulterOptions, channelPicMulterOptions, profilePicMulterOptions } from './multer.config';
import * as path from 'path';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { getId } from 'src/utils/getId';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import * as fs from 'fs';

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
		const newDir =  path.join(__dirname, '..', '..', 'uploads', 'background')
    	res.sendFile(filename, { root: newDir });
	}


	@UseGuards(JwtAuthGuard)
	@Post('channelPic')
	@UseInterceptors(FileInterceptor('file', channelPicMulterOptions))
	async uploadChannelPic(@UploadedFile() file: Express.Multer.File, @Req() req) {
  
	  if (file === undefined)
		  throw new BadRequestException('Server doesn\'t this upload')
	  const id = getId(req);
	  const channelName = req.headers.channelname;
	  if (channelName === undefined || channelName === '')
		throw new BadRequestException('No Channel Name Provided')
	  const newDir =  'http://localhost:8000/' + 'upload/profile/'
	  const filePath = newDir + file.filename
	  await this.uploadService.updateChannelPic(filePath, channelName)
	  return { valid:true, filename: filePath };
	}

	@UseGuards(JwtAuthGuard)
	@Delete('/channel/:filename')
	deleteChannelPic(@Param('filename') filename: string, @Res() res: Response) {
		const newDir =  path.join(__dirname, '..', '..', 'uploads', 'channels')
		const fileToDelete = newDir + '/' + filename;
		fs.unlink(fileToDelete, (err) => {
			if (err) {
				throw new ConflictException('Can\'t delete resource')
			  console.error(err);
			} else {
			  console.log('File is deleted.');
			}
		  });
    	res.status(204).send({msg: 'Deleted Successfully'});
	}
}
