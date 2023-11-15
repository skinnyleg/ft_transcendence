import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { FriendsService } from './friends.service';
import { Server, Socket } from 'socket.io';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { FriendRequestDto } from './Dto/userIdDto';
import { Record } from '@prisma/client/runtime/library';
import { RequestActionDto } from './Dto/requestDto';

@WebSocketGateway()
export class FriendsGateway {
  constructor(private readonly friendsService: FriendsService) {}
  @WebSocketServer()
  server: Server;


	async handleConnection(client: Socket) {
		await this.friendsService.saveUser(client)
	}

	@SubscribeMessage('add-friend')
	async sendFriendReq(client: Socket, payload: Record<string, any>)
	{
		const friendRequestDto = plainToClass(FriendRequestDto, payload);
		const errors = await validate(friendRequestDto);
		if (errors.length > 0) {
			const errorMessage = Object.values(errors[0].constraints).join(', ');
			this.friendsService.sendWebSocketError(client, errorMessage, false);
			return;
		}
		await this.friendsService.sendRequest(client, friendRequestDto.userId)
	}

	@SubscribeMessage('remove-friend')
	async deleteFriendReq(client: Socket, payload: Record<string, any>)
	{
		const deleteRequestDto = plainToClass(FriendRequestDto, payload);
		const errors = await validate(deleteRequestDto);
		if (errors.length > 0) {
			const errorMessage = Object.values(errors[0].constraints).join(', ');
			this.friendsService.sendWebSocketError(client, errorMessage, false);
			return;
		}
		await this.friendsService.deleteRequest(client, deleteRequestDto.userId)
	}

	@SubscribeMessage('accept-request')
	async acceptRequest(client: Socket, payload: Record<string, any>)
	{
		const RequestDto = plainToClass(RequestActionDto, payload);
		const errors = await validate(RequestDto);
		if (errors.length > 0) {
			const errorMessage = Object.values(errors[0].constraints).join(', ');
			this.friendsService.sendWebSocketError(client, errorMessage, false);
			return;
		}
		await this.friendsService.acceptRequest(client, RequestDto.userId, RequestDto.requestId);
	}

	@SubscribeMessage('refuse-request')
	async refuseRequest(client: Socket, payload: Record<string, any>)
	{
		const RequestDto = plainToClass(RequestActionDto, payload);
		const errors = await validate(RequestDto);
		if (errors.length > 0) {
			const errorMessage = Object.values(errors[0].constraints).join(', ');
			this.friendsService.sendWebSocketError(client, errorMessage, false);
			return;
		}
		await this.friendsService.refuseRequest(client, RequestDto.userId, RequestDto.requestId);
	}

	async handleDisconnect(client: Socket) {
		await this.friendsService.deleteUser(client)
	}

}
