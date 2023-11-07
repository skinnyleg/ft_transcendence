import { BadRequestException, Body, Controller, Post, Req } from '@nestjs/common';
import { QrService } from './qr.service';
import { getId } from 'src/utils/getId';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}


	@Post('check')
	verifyQrcode(@Body() payload :{code: string}, @Req() req) {
		const id = getId(req);
		return this.qrService.checkQrCode(payload.code, id);
	}

}
