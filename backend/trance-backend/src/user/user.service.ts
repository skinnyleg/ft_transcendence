import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { User, UserStatus } from '@prisma/client';
import { isStrongPassword } from 'src/utils/passwordStrength';
import { compareHash, hashPass } from 'src/utils/bcryptUtils';
import { generateNickname } from 'src/utils/generateNickname';

@Injectable()
export class UserService {

	constructor(private readonly prisma: PrismaService){}

  	async findOneByLogin(login: string) {
    const user = await this.prisma.user.findUnique({
			where: {
				login,
			},
		})
		return user;
  }



	async findOneByIntraId(intraId: number)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				intraId: intraId,
			}
		})
		return user;
	}

	async findOneById(Id: string)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				id: Id,
			}
		})
		return user;
	}



	async findOneByNickname(nick: string)
	{
		const user = await this.prisma.user.findUnique({
			where: {
				nickname: nick,
			}
		})
		return user;
	}



	async create(userData: any)
	{
		const nick = await generateNickname(userData.login);
		const hashedPass : string = await hashPass(userData.password);
		return await this.prisma.user.create({
			data: {
			intraId: userData.intraId,
			email: userData.email,
			login: userData.login,
			password: hashedPass,
			firstName: userData.firstName,
			lastName: userData.lastName,
			profilePic: userData.profilePic,
			BackgroundPic: userData.BackgroundPic,
			wallet: userData.wallet,
			level: userData.level,
			grade: userData.grade,
			status: UserStatus.ONLINE,
			nickname: nick,
			token: "",
			}
		})
	}


	async updateToken(id: string, token: string)
	{
		return await this.prisma.user.update({
			where:{
				id: id,
			},
			data: {
				token: token,
			}
		})
	}

	async getSecret(id: string)
	{
		const secret = await this.prisma.user.findUnique({
			where:{
				id,
			},
			select: {
				Secret: true
			}
		})
		if (!secret)
			throw new BadRequestException('User hasn\'t enable 2FA')
		return secret.Secret;
	}


		async changePassword(newPass : string, id : string) {
		// console.log("pass == ", newPass)
		// console.log("login == ", login)
		// const user = await this.findOneByLogin(login);
		if (!isStrongPassword(newPass))
			throw new BadRequestException('Password does not meet strength requirements');
		const user = await this.findOneById(id);

		if (!user)
			throw new UnauthorizedException("No User Found")
	
		// const isMatch = await compareHash(oldPass,user.password);
		// if (isMatch == false)
		// 	throw new UnauthorizedException('Wrong Crendentiels')

		const hashedPass = await hashPass(newPass);
		await this.prisma.user.update({
			where: {
				id:id,
			},
			data: {
				password: hashedPass,
				setPass: true
			}
		})
		return {valid: true}
	}




		async changeNickname(newNick : string, id: string) {

		const isunique = await this.findOneByNickname(newNick);
		if (isunique)
			throw new BadRequestException('nickname already taken')
	
		const user = await this.findOneById(id)

		if (!user)
			throw new BadRequestException("user doesn't exist")

		await this.prisma.user.update({
			where: {
				id: id
			},
			data: {
				nickname: newNick
			}
		})
		return {nick: newNick}

	}


	async privateProfile(id: string) {
    	const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
			id: true,
			nickname: true,
			login:true,
			wallet: true,
			grade:true,
			profilePic: true,
			BackgroundPic: true,
			level: true,
			status: true,
			isEnabled: true,
			},
		})
		if (!user)
			throw new BadRequestException('user not found')
		return user;
  }


	async publicProfile(id: string) {
    	const user = await this.prisma.user.findUnique({
			where: {
				login: id,
			},
			select: {
			id: true,
			nickname: true,
			login:true,
			wallet: true,
			grade:true,
			profilePic: true,
			BackgroundPic: true,
			level: true,
			status: true,
			},
		})
		if (!user)
			throw new BadRequestException('user not found')
		return user;
  }



	async TwoFA(id: string)
	{
		const user = await this.findOneById(id);
		if (!user)
			throw new BadRequestException('user not found')

		if (user.isEnabled == false)
		{
			const secret = authenticator.generateSecret();
			const url = authenticator.keyuri(user.login,'Pong',secret);
			await this.prisma.user.update({
				where: {
					id: id,
				},
				data: {
					isEnabled: true,
					Secret: secret,
					otpauth_url: url
				}
			})
			return {valid:true, img: url}
		}
		else
		{
			await this.prisma.user.update({
				where: {
					id: id,
				},
				data: {
					isEnabled: false,
					Secret: null,
					otpauth_url: null
				}
			})
			return {valid:false}
		}
	}

}
