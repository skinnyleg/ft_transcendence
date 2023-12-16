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
import { joinChannelDto, responseJoinChannelDto } from '../dto/joinChannelDto.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@WebSocketGateway({ namespace: 'chatGateway' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private jwtService: JwtService,
		private userService: UserService,
		private channelService: ChannelService,
		private Outils: ChannelOutils,
		private DmOutils: DmOutils,
		private DmService: DmService,
		private readonly prisma: PrismaService,
	){}

	@WebSocketServer()
	server: Server;

	private readonly usersSockets: {userId: string, socket: any}[] = [];

	async handleConnection(@ConnectedSocket() client: Socket)
	{
		const token: string = client.handshake.headers.token as string;
		const payload = await this.jwtService.verifyAsync(token, { secret: process.env.jwtsecret })
		const user = await this.userService.findOneById(payload.sub);
		client.data.user = user;
		console.log(`------ coonect: ${user.nickname} ------`);
		this.usersSockets.push({userId: user.id, socket: client});
		client.emit('userConnection', {msg: `${client.data.user.nickname} is connected`});
		await this.channelService.pushMutedUsers();
	}
		
	async handleDisconnect(@ConnectedSocket() client: Socket)
	{
		console.log(`------ disconnect: ${client.data.user.nickname} ------`);
		client.disconnect();
	}

	@SubscribeMessage('creatChannel')
	  async	handleChannelCreated(@MessageBody() data: creatChannelDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			// add a field for the picture of channel
			const owner = client.data.user.nickname;
			data.type = data.type.toUpperCase();
			if (data.name.length > 10) {
				throw new BadRequestException(`The name of channel should be less than or equal 10`);
			}
			if (data.type !== 'PROTECTED' && data.type !== 'PUBLIC' && data.type !== 'PRIVATE') {
				throw new BadRequestException(`Channel type ${data.type} unknow.`);
			}
			const newChannel = await this.channelService.creatChannel(data, owner);
			console.log(`${owner} creat new channel: `, newChannel);
			client.emit('channelCreated', newChannel);
		}
		catch (error)
		{
			console.error('Error creating channel:', error.message);
			client.emit('Failed', { error: 'Failed to create a new channel.' });
		}
	}

	@SubscribeMessage('joinChannel')
	async	handleAddUser2Channel(@MessageBody() data: joinChannelDto,  @ConnectedSocket() client: Socket)
	{
		try
		{
			const {channelName, password} = data;
			const user = client.data.user.nickname;
			const updateChannelUsers = await this.channelService.joinChannel(channelName, user, password);
			if (updateChannelUsers[0] === 'PRIVATE') {
				this.server.to(updateChannelUsers[1]).emit('joinChannelRequest', { channelName, user });
				return;
			}
			else {
				client.emit('userAdded2Channel', updateChannelUsers);
			}
		}
		catch (error)
		{
			client.emit('Failed', error.message);
		}
	}

	@SubscribeMessage('responseJoinChannel')
	async	handleResponseJoinChannel(@MessageBody() data: responseJoinChannelDto,  @ConnectedSocket() client: Socket)
	{
		try
		{
			const {channelName, user, value} = data;
			if (value) {
				await this.prisma.channel.update({
					where: { name: channelName },
					data: {
						users: {
							connect: { nickname: user },
						},
					},
		
				});
				client.emit('userAdded2Channel', `Your request to join channel ${channelName} accepted`);
			}
			else {
				client.emit('userAdded2Channel', `Your request to join channel ${channelName} rejected`);
			}
		}
		catch (error)
		{
			client.emit('Failed', error.message);
		}
	}

	@SubscribeMessage('sendMessageCH')
	async	handleSendMessageCh(@MessageBody() data: creatMessageCh, @ConnectedSocket() client: Socket)
	{
		try
		{
			const {channelId, content} = data;
			const isUserInBlacklist = await this.Outils.isUserInBlacklist(channelId, client.data.user.nickname);
			if (isUserInBlacklist) {
				throw new UnauthorizedException(`you are not allowed to send message`);
			}
			const channels = await this.channelService.getUserChannels(client.data.user.nickname);
			const message = await this.channelService.creatMessageChannel(channelId, client.data.user.nickname, content);
			const Id = await this.Outils.getChannelIdByName(channelId);
			for (const channel of channels) {
				// check blocked and bane users and don't join theme into the room
				client.join(channel.id);
			}
			this.server.to(Id).emit('sendMessageDone', message);
			for (const channel of channels) {
				// check blocked and bane users and don't join theme into the room
				client.leave(channel.id);
			}
		}
		catch (error)
		{
			console.error('message faild channel');
			client.emit('Faild', error.message);
		}
	}

	@SubscribeMessage('sendMessageDM')
	async	handleSendMessageDm(@MessageBody() data: any, @ConnectedSocket() client: Socket)
	{
		try
		// check if i'm blocked by this users
		{
			let dmId = '';
			const {receiver, content} = data;
			const user2Id = await this.Outils.getUserIdByName(receiver);
			dmId = await this.DmOutils.getDmIdby2User(client.data.user.id, user2Id);
			if (dmId === null) {
				await this.DmService.creatDMchat(client.data.user.id, user2Id);
				dmId = await this.DmOutils.getDmIdby2User(client.data.user.id, user2Id);
			}
			const receiverSocket = this.usersSockets.find(user => user.userId === user2Id);
			client.join(dmId);
			receiverSocket.socket.join(dmId);
			const message = await this.DmService.creatMessageDm(dmId, client.data.user.nickname, content);
			this.server.to(dmId).emit('sendMessageDone', message);
			client.leave(dmId);
			receiverSocket.socket.leave(dmId);
		}
		catch (error)
		{
			console.error('message faild dm', error.message);
			client.emit('Faild', 'message faild to send dm');
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
			client.emit('Failed', { error: 'Failed to leave channel.' });
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
			client.emit('Failed', { error: 'Failed to kick that user.' });
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
			client.emit('Failed', { error: 'Failed to change owner of channel.' });
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
			client.emit('Failed', { error: 'Failed to ban that user.' });
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
			client.emit('Failed', { error: 'Failed to mute that user.' });
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
			client.emit('Failed', `the channel is Failed to change type.`);
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
			client.emit('Failed', `the channel is Failed to change name.`);
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
			client.emit('Failed', `the channel is Failed to change password.`);
		}
	}

	// add event to change picture of channel by owner.
	//add event to get channel users and admins and owner.

	@SubscribeMessage('getUserChannels')
	async handleGetUserChannels(@MessageBody() nickname: string, @ConnectedSocket() client: Socket)
	{
		try
		{
			const updatedChannels = await this.channelService.getUserChannels(client.data.user.nickname);
			client.emit('UserChannels', updatedChannels);
		}
		catch(error)
		{
			if (error instanceof NotFoundException) {
				console.error('Resource not found.');
			}
			else if (error instanceof UnauthorizedException) {
				console.error('Unauthorized access.');
			}
			else {
				console.error('An unexpected error occurred:', error.message);
			}
			client.emit('Failed', { error: 'Failed to get channels.' });
		}
	}

	// add event for search for a all channels by the user
	// search for dm for all user friends
	// add event to search for a user in the channel users
}
