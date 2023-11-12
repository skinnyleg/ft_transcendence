import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { gatewayUser } from 'src/classes/classes';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { Socket , Server} from 'socket.io';
import { Status, UserStatus } from '@prisma/client';

@Injectable()
export class FriendsService {
	constructor(private jwtService: JwtService,
				private userService: UserService,
				private prisma: PrismaService){}

	private Users: gatewayUser[] = [];


	sendWebSocketError(client: Socket, errorMessage: string)
	{
		client.emit('error', { message: errorMessage });
		client.disconnect();
	}

	async saveUser(client: Socket, server: Server) {
		
		try {
			const token: string = client.handshake.headers.token as string;
			const payload = await this.jwtService.verifyAsync(token, { secret: process.env.jwtsecret })
			const user = await this.userService.findOneById(payload.sub);
			await this.userService.updateStatus(user.id, UserStatus.ONLINE)
			this.Users.push({ id: user.id, socket: client });
			// const friends = await this.userService.getFriends(user.id)
			// console.log("friends == ", friends)
			server.emit('statusChange', { id: user.id, status: "online" });
		}
		catch (error)
		{
			this.sendWebSocketError(client, "User not found")
		}
	}


	async deleteUser(client: Socket, server: Server) {
		
		try {
			
			const user = this.getUserBySocketId(client.id);
			await this.userService.updateStatus(user.id, UserStatus.OFFLINE)
			this.Users = this.Users.filter((u) => u.socket.id !== client.id);
			server.emit('statusChange', { id: user.id, status: "offline" });
		}
		catch (error)
		{
			this.sendWebSocketError(client, "Error on disconnecting")
		}
	}



	async sendRequest(client: Socket, userId: string)
	{
		const toSend = this.getUserById(userId);
		const sender = this.getUserBySocketId(client.id);
		console.log("sender == ", sender.id)
		console.log("tosend == ", client.id)
		// console.log("type of ids == ", typeof sender.id)
		// console.log("type of ids == ", typeof toSend.id)
		await this.userService.setNewFriend(userId, sender.id, Status.PENDING)
		// client.emit('request-sent', 'Friend request sent successfully');
	}

	getUserBySocketId(socketId: string): gatewayUser | undefined {
	  return this.Users.find((user) => user.socket.id === socketId);
	}

	getUserById(userId: string): gatewayUser | undefined {
	  return this.Users.find((user) => user.id === userId);
	}





}
