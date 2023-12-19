import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { compareHash } from 'src/utils/bcryptUtils';
import { REFRESHEXP, REFRESHSECRET, TOKENEXP, TOKENSECRET } from 'src/classes/classes';
import { getId } from 'src/utils/getId';

@Injectable()
export class AuthService {

		constructor (private prisma: PrismaService,
				private jwtservice: JwtService
	){}

	async signIn(username: string , password: string,  res: Response) {

		const user = await this.prisma.user.findUnique({
			where: {
				nickname : username
			}
		})

		if (!user)
			throw new NotFoundException("User Doesn't Exits")
	
		if (user.setPass == false)
			throw new BadRequestException('you need to set up a password')

		const isMatch = await compareHash(password, user.password);
		if (isMatch == false)
			throw new UnauthorizedException('Wrong Crendentiels')
		res.cookie('id', user.id, {signed: true})
		if (user.isEnabled == true)
			res.redirect(`${process.env.FrontendHost}/Qr`);
		const token = await this.createToken(user.id, user.nickname, TOKENEXP, TOKENSECRET)
		const refresh = await this.createToken(user.id, user.nickname, REFRESHEXP, REFRESHSECRET)
		res.cookie('token', token, {maxAge: TOKENEXP * 1000})
		res.cookie('refresh', refresh, {maxAge: REFRESHEXP * 1000})
		console.log("token == ", token)
		res.status(200).json(token);
	}

	async signOut(res: Response) {
		res.clearCookie('token');
		res.clearCookie('refresh');
		res.clearCookie('id');
		res.redirect(`${process.env.FrontendHost}/`)
		// return res.status(200).send({message: "signOut was succefull"})
	}


	async createToken(id: string, login: string, expiresIn: number, secret: string)
	{
		const payload = {sub: id, username: login}

		const token = await this.jwtservice.signAsync(payload, {
			expiresIn,
			secret,
		});
		
		if (!token)
			throw new InternalServerErrorException();
		return token;
	}


	async refreshTokens(req: Request, res: Response)
	{
		const id = getId(req);
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			}
		})

		if (!user)
			throw new NotFoundException("User Doesn't Exits")
		res.clearCookie('token');
		res.clearCookie('refresh');
		const token = await this.createToken(user.id, user.nickname, TOKENEXP, TOKENSECRET)
		const refresh = await this.createToken(user.id, user.nickname, REFRESHEXP, REFRESHSECRET)
		res.cookie('token', token, {maxAge: TOKENEXP * 1000})
		res.cookie('refresh', refresh, {maxAge: REFRESHEXP * 1000})
		res.status(200).json(token);
	}


	async checkFirstLogin(id: string, res: Response)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				FirstLogin: true,
			}
		})
		if (!user)
			throw new NotFoundException('user not found')

		res.status(200).send(user)
	}

	async updateFirstLogin(id: string, res: Response)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				FirstLogin: true,
			}
		})
		if (!user)
			throw new NotFoundException('user not found')
		
		if (user.FirstLogin === false)
			throw new ConflictException('already updated the value')


		const updatedUser = await this.prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				FirstLogin: false,
			}
		})
		if (!updatedUser)
			throw new NotFoundException('couldn\'t update user')
			res.status(200).send({valid: true})
	}
}
