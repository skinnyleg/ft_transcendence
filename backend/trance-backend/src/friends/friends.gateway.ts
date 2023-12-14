import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { FriendsService } from './friends.service';
import { Server, Socket } from 'socket.io';
import { FriendRequestDto } from './Dto/userIdDto';
import { Record } from '@prisma/client/runtime/library';
import { RequestActionDto } from './Dto/requestDto';
import { validateAndSendError } from 'src/utils/validateInputWebsocket';

@WebSocketGateway({ namespace: 'friendsGateway' })
export class FriendsGateway {
  constructor(private readonly friendsService: FriendsService) {}
  @WebSocketServer()
  server: Server;


	async handleConnection(client: Socket) {
		await this.friendsService.saveUser(client);
		console.log(client.id);
	}

	@SubscribeMessage('add-friend')
	async sendFriendReq(client: Socket, payload: Record<string, any>)
	{
		const verify = await validateAndSendError(payload, FriendRequestDto);
		if (verify.valid == true)
			this.friendsService.sendWebSocketError(client, verify.error, false);
		else
			await this.friendsService.sendRequest(client, verify.input.userId)
	}

	@SubscribeMessage('remove-friend')
	async deleteFriendReq(client: Socket, payload: Record<string, any>)
	{
		const verify = await validateAndSendError(payload, FriendRequestDto);
		if (verify.valid == true)
			this.friendsService.sendWebSocketError(client, verify.error, false);
		else
			await this.friendsService.deleteRequest(client, verify.input.userId)
	}

	@SubscribeMessage('accept-request')
	async acceptRequest(client: Socket, payload: Record<string, any>)
	{
		const verify = await validateAndSendError(payload, RequestActionDto);
		if (verify.valid == true)
			this.friendsService.sendWebSocketError(client, verify.error, false);
		else
			await this.friendsService.acceptRequest(client, verify.input.userId, verify.input.requestId);
	}

	@SubscribeMessage('refuse-request')
	async refuseRequest(client: Socket, payload: Record<string, any>)
	{
		const verify = await validateAndSendError(payload, RequestActionDto);
		if (verify.valid == true)
			this.friendsService.sendWebSocketError(client, verify.error, false);
		else
			await this.friendsService.refuseRequest(client, verify.input.userId, verify.input.requestId);
	}

	async handleDisconnect(client: Socket) {
		await this.friendsService.deleteUser(client)
		client.disconnect();
	}

}
