import { BadRequestException, Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/user.service';

@Injectable()
export class QrService {

	constructor(private userservice: UserService){}

	async checkQrCode(QrCode: string, id: string)
	{
		const secret = await this.userservice.getSecret(id);
		if (!secret)
			throw new BadRequestException('user hasn\'t enabled 2FA')

		const isValid = authenticator.check(QrCode, secret);
		 if (isValid) {
		   return { valid: true };
		 } else {
		   return { valid: false };
		 }
	}

}
