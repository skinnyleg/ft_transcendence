import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class QrService {

	constructor(private userservice: UserService,
				private authService: AuthService){}

	async checkQrCode(QrCode: string, id: string, res: Response)
	{
		const secret = await this.userservice.getSecret(id);
		if (!secret)
			throw new BadRequestException('user hasn\'t enabled 2FA')

		const user = await this.userservice.findOneById(id);
		if (!user)
			throw new BadRequestException('User Doesn\'t exist')

		const isValid = authenticator.check(QrCode, secret);
		 if (isValid)
		{
			const token = await this.authService.createToken(user.id, user.login)
			res.cookie('token', token);
		   return { valid: true, token: token };
		 } else {
		   return { valid: false };
		 }
	}

}
