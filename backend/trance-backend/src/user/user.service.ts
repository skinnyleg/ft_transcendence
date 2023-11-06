import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserStatus } from 'src/classes/classes';
import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';

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

	async create(userData: any, token: string)
	{
		await this.prisma.user.create({
			data: {
			intraId: userData.intraId,
			email: userData.email,
			login: userData.login,
			// password: hashedPass,
			firstName: userData.firstName,
			lastName: userData.lastName,
			profilePic: userData.profilePic,
			wallet: userData.wallet,
			level: userData.level,
			grade: userData.grade,
			token: token,
			status: userData.status,
			}
		})
	}

	async getSecret(login: string)
	{
		const secret = await this.prisma.user.findUnique({
			where:{
				login: login,
			},
			select: {
				Secret: true
			}
		})

		return secret.Secret;
	}


		async changePassword(newPass : string, login : string, oldPass: string) {
		// console.log("pass == ", newPass)
		// console.log("login == ", login)
		const user = await this.findOneByLogin(login);
		const isMatch = await bcrypt.compare(oldPass,user.password);
		if (isMatch == false)
			throw new UnauthorizedException('Wrong Crendentiels')

		const SALT_ROUNDS = 10;
		const hashedPass = await bcrypt.hash(newPass, SALT_ROUNDS);
		// const hashedPass = newPass;
		await this.prisma.user.update({
			where: {
				login: login
			},
			data: {
				password: hashedPass
			}
		})
		return 'password changed succufully'

	}




		async changeNickname(newNick : string, login : string) {
		// console.log("login == ", login)
		// console.log("newNick == ", newNick);
		
		const user = await this.findOneByLogin(login);

		if (!user)
			throw new BadRequestException("user doesn't exist")

		await this.prisma.user.update({
			where: {
				login: login
			},
			data: {
				nickname: newNick
			}
		})
		return {nick: newNick}

	}




	async userProfile(id: string) {
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
			level: true,
			status: true,
			},
		})
		return user;
  }



	async enableTwoFA(login: string)
	{
		console.log("enabling")
		// user.isEnabled = !user.isEnabled;
		// using authenticator
		const secret = authenticator.generateSecret();
		const url = authenticator.keyuri(login,'Pong',secret);
		// console.log("secret == ", secret)
		// console.log("url == ", url)
		await this.prisma.user.update({
			where: {
				login: login,
			},
			data: {
				isEnabled: true,
				Secret: secret,
				otpauth_url: url
			}
		})
		return {valid:true, img: url}
	}

	async disableTwoFA(login: string)
	{
		console.log("disabling")
		await this.prisma.user.update({
			where: {
				login: login,
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
