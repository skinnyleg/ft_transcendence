import { BadRequestException, Body, Controller, Post, Req } from '@nestjs/common';
import { QrService } from './qr.service';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}


	@Post('check')
	verifyQrcode(@Body() payload :{code: string}, @Req() req) {
		const idString = req.cookies.id
		const id = parseInt(idString, 10)
		if (isNaN(id))
			throw new BadRequestException('id not valid number')
		// console.log("payload == ", payload)
		return this.qrService.checkQrCode(payload.code, id);
	}

}
