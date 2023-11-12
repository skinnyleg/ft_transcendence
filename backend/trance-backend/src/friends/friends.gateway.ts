import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { FriendsService } from './friends.service';
import { Server, Socket } from 'socket.io';
import { Body, Req } from '@nestjs/common';

@WebSocketGateway()
export class FriendsGateway {
  constructor(private readonly friendsService: FriendsService) {}
  @WebSocketServer()
  server: Server;


	async handleConnection(client: Socket) {
		await this.friendsService.saveUser(client, this.server)
	}

	@SubscribeMessage('send-request')
	async sendFriendReq(client: Socket, payload: {userId: string})
	{
		await this.friendsService.sendRequest(client, payload.userId)
	}



	async handleDisconnect(client: Socket) {
		await this.friendsService.deleteUser(client, this.server)
	}

}
