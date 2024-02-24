import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { compareHash, hashPass } from 'src/utils/bcryptUtils';
import { REFRESHEXP, REFRESHSECRET, TOKENEXP, TOKENSECRET } from 'src/classes/classes';
import { getId } from 'src/utils/getId';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

		constructor (private prisma: PrismaService,
				private jwtservice: JwtService,
				private userservice: UserService
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
		{
			throw new BadRequestException('you need to set up a password')
		}
		const isMatch = await compareHash(password, user.password);
		if (isMatch == false)
			throw new UnauthorizedException('Wrong Crendentiels')
		res.cookie('id', user.id, {signed: true})
		if (user.isEnabled == true)
		{
			res.status(202).json({valid: true});
			return ;
		}
		const token = await this.createToken(user.id, user.nickname, TOKENEXP, TOKENSECRET)
		const refresh = await this.createToken(user.id, user.nickname, REFRESHEXP, REFRESHSECRET)
		res.cookie('token', token)
		res.cookie('refresh', refresh)
		res.status(200).json(token);
	}


	async signUp(username: string , password: string,  res: Response) {

		const NicknameExists = await this.prisma.user.findUnique({
			where: {
				nickname : username
			}
		})
		console.log('user with nick === ', NicknameExists);
		if (NicknameExists)
			throw new NotFoundException("Nickname already taken")
		const user = await this.userservice.createNewUser(username, password);
		const token = await this.createToken(user.id, user.nickname, TOKENEXP, TOKENSECRET)
		const refresh = await this.createToken(user.id, user.nickname, REFRESHEXP, REFRESHSECRET)
		res.cookie('id', user.id, {signed: true})
		res.cookie('token', token)
		res.cookie('refresh', refresh)
		// console.log("token == ", token)
		res.status(200).json(token);
	}


	async signOut(res: Response) {
		res.clearCookie('token');
		res.clearCookie('refresh');
		res.clearCookie('id');
		res.redirect(`${process.env.FrontendHost}/`)
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


	async refreshTokens(req: Request, res: Response, id: string)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			}
		})

		if (!user)
			throw new NotFoundException("User Doesn't Exits")
		const token = await this.createToken(user.id, user.nickname, TOKENEXP, TOKENSECRET)
		const refresh = await this.createToken(user.id, user.nickname, REFRESHEXP, REFRESHSECRET)
		res.cookie('token', token)
		res.cookie('refresh', refresh)
		res.status(200).json({token: token, refresh: refresh});
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

		res.status(200).send(user);
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
		{
			res.status(200).send({valid: true})
			return ;
		}

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
		res.status(200).send({valid: true});
	}
}
