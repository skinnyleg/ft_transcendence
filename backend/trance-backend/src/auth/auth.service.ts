import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { compareHash } from 'src/utils/bcryptUtils';

@Injectable()
export class AuthService {

		constructor (private prisma: PrismaService,
				private jwtservice: JwtService
	){}

	async signIn(username: string , password: string,  res: Response) {

		const user = await this.prisma.user.findUnique({
			where: {
				login : username
			}
		})

		if (!user)
			throw new BadRequestException("User Doesn't Exits")
	
		// if (user.setPass == false)
		// 	throw new BadRequestException('you need to set up a password')

		const isMatch = await compareHash(password, user.password);
		if (isMatch == false)
			throw new UnauthorizedException('Wrong Crendentiels')
		
		const payload = {sub: user.id, username: user.login}

		const token = await this.jwtservice.signAsync(payload);
		
		if (!token)
			throw new ForbiddenException();

		await this.prisma.user.update({
			where:{
				id: user.id,
			},
			data: {
				token: token,
			}
		})
		res.cookie('id', user.id)
		res.cookie('token', token);
		return res.send({message: "signIn is succefull"})
	}

	async signOut(req: Request, res: Response) {
		res.clearCookie('token');
		res.clearCookie('accesstoken');
		console.log("signing out")
		return res.send({message: "signOut was succefull"})
	}


	async createToken(id: string, login: string)
	{
		const payload = {sub: id, username: login}

		const token = await this.jwtservice.signAsync(payload);
		
		if (!token)
			throw new ForbiddenException();
		return token;
	}
}
