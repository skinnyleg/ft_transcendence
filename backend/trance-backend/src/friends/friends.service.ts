import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { gatewayUser } from 'src/classes/classes';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Socket } from 'socket.io';

@Injectable()
export class FriendsService {
	constructor(private jwtService: JwtService,
				private userService: UserService,
				private prisma: PrismaService){}

	private Users : gatewayUser[] = [];



	async getUser(client: Socket) {
		
		try {
			const token: string = client.handshake.headers.token as string;
			const user = await this.jwtService.verifyAsync(token, { secret: process.env.jwtsecret})
			console.log("user == ", user)
		}
		catch (error)
		{
			console.log("errpr ");
		}
	}
}
