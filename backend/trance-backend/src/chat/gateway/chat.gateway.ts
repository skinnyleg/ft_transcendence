import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from '../channel/channel.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { creatChannelDto } from '../dto/creat-channel.dto';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { changeOwner } from '../dto/changeOwner.dto';
import { DmOutils } from '../dm/dm.outils';
import { creatMessageCh } from '../dto/creat-message.dto';
import { ChannelOutils } from '../channel/outils';
import { DmService } from '../dm/dm.service';

@WebSocketGateway({ namespace: 'chatGateway' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private channelService: ChannelService,
		private Outils: ChannelOutils,
		private DmOutils: DmOutils,
		private DmService: DmService,
	){}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('message')
	handleMessage(client: any, payload: any): string {
		return 'Hello world!';
	}

	async handleConnection(@ConnectedSocket() client: Socket)
	{
		const token: string = client.handshake.headers.token as string;
		const payload = await this.jwtService.verifyAsync(token, { secret: process.env.jwtsecret })
		const user = await this.userService.findOneById(payload.sub);
		client.data.user = user;
		console.log(`------ coonect: ${user.nickname} ------`);
		console.log(`------ token: ${token} ------`);
		client.emit('userConnection', {msg: `a new user is connected ${client.id}`});
		await this.channelService.pushMutedUsers();
		const channels = await this.channelService.getUserChannels(user.nickname, client);
		for (const channel of channels) {
			client.join(channel.id);
		}
		// const dm = await this.dmservice.getUserDm();
	}
		
	async handleDisconnect(@ConnectedSocket() client: Socket)
	{
		console.log(`------ disconnect: ${client.data.user.nickname} ------`);
		client.disconnect();
	}

	@SubscribeMessage('sendMessageCH')
	async	handleSendMessageCh(@MessageBody() data: creatMessageCh, @ConnectedSocket() client: Socket)
	{
		try
		{
			const {channelId, content} = data;
			const message = await this.channelService.creatMessageChannel(channelId, client.data.user.nickname, content);
			const Id = await this.Outils.getChannelIdByName(channelId);
			this.server.to(Id).emit('sendMessageDone', message);
		}
		catch (error)
		{
			console.error('message faild channel');
			client.emit('sendMessageFaild', 'message faild to send channel');
		}
	}

	@SubscribeMessage('sendMessageDM')
	async	handleSendMessageDm(@MessageBody() data: any, @ConnectedSocket() client: Socket)
	{
		// check blocker users
		try
		{
			let dmId = '';
			const {receiver, content} = data;
			const user2Id = await this.Outils.getUserIdByName(receiver);
			dmId = await this.DmOutils.getDmIdby2User(client.data.user.id, user2Id);
			if (dmId === null) {
				this.DmService.creatDMchat(client.data.user.id, user2Id);
				dmId = await this.DmOutils.getDmIdby2User(client.data.user.id, user2Id);
				client.join(dmId);
				for (const [socketId, socket] of Object.entries(this.server.sockets.sockets)) {
					const user = socket.data.user;
					if (user.id === user2Id) {
						socket.join(dmId);
						break;
					}
				}
			}
			const message = await this.DmService.creatMessageDm(dmId, client.data.user.nickname, content);
		}
		catch
		{
			console.error('message faild dm');
			client.emit('sendMessageFaild', 'message faild to send dm');
		}
	}


	
	@SubscribeMessage('creatChannel')
  	async	handleChannelCreated(@MessageBody() data: creatChannelDto, @ConnectedSocket() client: Socket)
	{
    	try
		{
			//should i determine the length of channel name
			// console.log('data owner', data.owner);
			// console.log('client data user nickname', client.data.user.nickname);
			if (data.owner !== client.data.user.nickname){
				throw new Error('The client should be the owner of this channel.');
			}
			const newChannel = await this.channelService.creatChannel(data);
			console.log(`${data.owner} creat new channel: `, newChannel);
			client.emit('channelCreated', newChannel);
		}
    	catch (error)
    	{
      		console.error('Error creating channel:', error);
			client.emit('channelCreationFailed', { error: 'Failed to create a new channel.' });
      		// throw new Error('Failed to create a new channel.');
    	}
	}

	@SubscribeMessage('getUserChannels')
	async handleGetUserChannels(@MessageBody() nickname: string, @ConnectedSocket() client: Socket)
	{
		try
		{
			const updatedChannels = await this.channelService.getUserChannels(nickname, client);
			client.emit('UserChannels', updatedChannels);
			// console.log('updatedChannels is:', updatedChannels);
		}
		catch(error)
		{
			if (error instanceof NotFoundException) {
				console.error('Resource not found.');
            } else if (error instanceof UnauthorizedException) {
				console.error('Unauthorized access.');
            } else {
				console.error('An unexpected error occurred:', error.message);
            }
			client.emit('getUserChannelsFailed', { error: 'Failed to get channels.' });
		}
	}

	@SubscribeMessage('leaveChannel')
	async	handleLeaveChannel(@MessageBody() channelName: string, @ConnectedSocket() client: Socket)
	{
		try
		{
			console.log('channel name befor: ', channelName);
			console.log('username befor: ', client.data.user.nickname);
			await this.channelService.leaveChannel(channelName, client.data.user.nickname);
			client.emit('leaveChannelDone', {msg: 'you are now out of this channel'});
		}
		catch(error)
		{
			if (error instanceof NotFoundException) {
				console.error('Resource not found.');
			}
			else if (error instanceof BadRequestException) {
				console.error('owner should set another owner before leave channel');
            }
			else if (error instanceof UnauthorizedException) {
				console.error('Unauthorized access.');
            }
			else {
				console.error('An unexpected error occurred:', error.message);
            }
			client.emit('leaveChannelFailed', { error: 'Failed to leave channel.' });
		}
	}

	@SubscribeMessage('changeOwner')
	async	handleChangeOwner(@MessageBody() data: changeOwner, @ConnectedSocket() client: Socket)
	{
		try
		{
			const {channelName, newOwner} = data;
			await this.channelService.changeOwnerOfChannel(channelName, client.data.user.nickname, newOwner);
			client.emit('changeOwnerDone', { msg: `the ${newOwner} is the new owner of ${channelName}.`});
		}
		catch(error)
		{
			if (error instanceof NotFoundException) {
				console.error('Resource not found.');
			}
			else if (error instanceof BadRequestException) {
				console.error('error in client side from changeOwner event');
            }
			else if (error instanceof UnauthorizedException) {
				console.error('Unauthorized access.');
            }
			else {
				console.error('An unexpected error occurred:', error.message);
            }
			client.emit('changeOwnerFailed', { error: 'Failed to change owner of channel.' });
		}
	}

	@SubscribeMessage('kickUser')
	async	handleKickUser(@MessageBody() data: any, @ConnectedSocket() client: Socket)
	{
		try
		{
			const {channelName, user2kick} = data;
			await this.channelService.kickUser(channelName, client.data.user.nickname, user2kick);
			client.emit('kickUserDone', {msg: `the ${user2kick} is kicked from the channel by ${client.data.user.nickname}`});
		}
		catch(error)
		{
			console.error('error in kick user');
			client.emit('kickUserFailed', { error: 'Failed to kick that user.' });
		}
	}

	@SubscribeMessage('banUser')
	async	handleBanUser(@MessageBody() data: any, @ConnectedSocket() client: Socket)
	{
		try
		{
			const {channelName, user2kick} = data;
			await this.channelService.banUser(channelName, client.data.user.nickname, user2kick);
			client.emit('banUserDone', {msg: `the ${user2kick} is baned from the channel by ${client.data.user.nickname}`});
		}
		catch(error)
		{
			console.error('error in ban user');
			client.emit('banUserFailed', { error: 'Failed to ban that user.' });
		}
	}

	@SubscribeMessage('muteUser')
	async	handleMuteUser(@MessageBody() data: any, @ConnectedSocket() client: Socket)
	{
		try
		{
			const {channelName, user2mute, expirationTime} = data;
			await this.channelService.muteUser(channelName, client.data.user.nickname, user2mute, expirationTime);
			client.emit('muteUserDone', {msg: `the ${user2mute} is muteed from the channel by ${client.data.user.nickname}`});
		}
		catch(error)
		{
			//-----------------------------
			if (error instanceof NotFoundException) {
				console.error('Resource not found.');
			}
			else if (error instanceof BadRequestException) {
				console.error('error in client side from mute user event');
            }
			else if (error instanceof UnauthorizedException) {
				console.error('Unauthorized access.');
            }
			else {
				console.error('An unexpected error occurred:', error.message);
            }
			//-----------------------------
			// console.error('error in mute user');
			client.emit('muteUserFailed', { error: 'Failed to mute that user.' });
		}
	}

	@SubscribeMessage('changeTypeOfChannel')
	async	handleChangeTypeOfChannel(@MessageBody() data: any, @ConnectedSocket() client: Socket)
	{
		try
		{
			const {channelName, newType, password} = data;
			console.log('pass is :', password);
			await this.channelService.changeTypeOfChannel(channelName, client.data.user.nickname, newType, password);
			client.emit('changeTypeDone', `the channel is changed to type: ${newType}.`);
		}
		catch (error)
		{
			client.emit('changeTypeFailed', `the channel is Failed to change type.`);
		}
	}

	@SubscribeMessage('changeNameOfChannel')
	async	handleChangeNameOfChannel(@MessageBody() data: any, @ConnectedSocket() client: Socket)
	{
		try
		{
			const {channelName, newName} = data;
			await this.channelService.changeNameOfChannel(channelName, client.data.user.nickname, newName);
			client.emit('changeNameDone', `the channel is changed to name: ${newName}.`);
		}
		catch (error)
		{
			client.emit('changeNameFailed', `the channel is Failed to change name.`);
		}
	}

	@SubscribeMessage('changePassOfChannel')
	async	handleChangePassOfChannel(@MessageBody() data: any, @ConnectedSocket() client: Socket)
	{
		try
		{
			const {channelName, newPassword} = data;
			await this.channelService.changePassOfChannel(channelName, client.data.user.nickname, newPassword);
			client.emit('changePassDone', `the channel is changed the password.`);
		}
		catch (error)
		{
			client.emit('changePassFailed', `the channel is Failed to change password.`);
		}
	}
}
