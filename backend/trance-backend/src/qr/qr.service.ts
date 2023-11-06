import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { UserService } from 'src/user/user.service';

@Injectable()
export class QrService {

	constructor(private userservice: UserService){}

	async checkQrCode(QrCode: string, id: number)
	{
		// console.log("login in check is ", login)
		const secret = await this.userservice.getSecret(id);
	

		const isValid = authenticator.check(QrCode, secret);
		// console.log("is valid == ", isValid)
		 if (isValid) {
		   // Code is valid; mark 2FA as enabled for the user
		   return { valid: true, id: id};
		 } else {
		   return { valid: false};
		 }
	}

}
