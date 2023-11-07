import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/user.service';

@Injectable()
export class QrService {

	constructor(private userservice: UserService){}

	async checkQrCode(QrCode: string, id: number)
	{
		const secret = await this.userservice.getSecret(id);
		const isValid = authenticator.check(QrCode, secret);
		 if (isValid) {
		   return { valid: true };
		 } else {
		   return { valid: false };
		 }
	}

}
