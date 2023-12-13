import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { AuthService } from 'src/auth/auth.service';
import { REFRESHEXP, REFRESHSECRET, TOKENEXP, TOKENSECRET } from 'src/classes/classes';
import { UserService } from 'src/user/user.service';

@Injectable()
export class QrService {

	constructor(private userservice: UserService,
				private authService: AuthService){}

	async checkQrCode(QrCode: string, id: string, res: Response)
	{
		const secret = await this.userservice.getSecret(id);
		if (!secret)
			throw new ConflictException('user hasn\'t enabled 2FA')

		const user = await this.userservice.findOneById(id);
		if (!user)
			throw new NotFoundException('User Doesn\'t exist')

		const isValid = authenticator.check(QrCode, secret);
		 if (isValid)
		{
			const token = await this.authService.createToken(user.id, user.nickname, TOKENEXP, TOKENSECRET)
			const refresh = await this.authService.createToken(user.id, user.nickname, REFRESHEXP, REFRESHSECRET)
			res.cookie('token', token, {signed: true, maxAge: TOKENEXP * 1000})
			res.cookie('refresh', refresh, {signed: true, maxAge: REFRESHEXP * 1000})
			res.status(200).json(token);
		 } else {
			throw new UnauthorizedException('not allowed')
		 }
	}

}
