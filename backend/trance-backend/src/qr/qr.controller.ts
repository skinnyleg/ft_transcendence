import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { QrService } from './qr.service';
import { getId } from 'src/utils/getId';
import { VerifyQrCodeDto } from './Dto/qrCodeDto';

@Controller('qr')
export class QrController {
  constructor(private readonly qrService: QrService) {}


	@Post('check')
	verifyQrcode(@Body() payload: VerifyQrCodeDto, @Req() req, @Res() res) {
		const id = getId(req);
		return this.qrService.checkQrCode(payload.code, id, res);
	}

}
