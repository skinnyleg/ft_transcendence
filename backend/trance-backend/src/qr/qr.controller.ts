import { Body, Controller, Post, Req } from '@nestjs/common';
import { QrService } from './qr.service';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}



	@Post('check')
	verifyQrcode(@Body() payload :{code: string}, @Req() req) {
		const login = req.cookies.login
		// console.log("payload == ", payload)
		return this.qrService.checkQrCode(payload.code, login);
	}

}
