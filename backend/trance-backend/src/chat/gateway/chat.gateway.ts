import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from '../channel/channel.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { creatChannel } from '../dto/creat-channel.dto';
import { BadRequestException, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { DmOutils, dmMessages, dmsSide } from '../dm/dm.outils';
import { creatMessageCh, getMessagesCH, getMessagesDm, sendMessageDm } from '../dto/messages.dto';
import { ChannelOutils, channelSidebar, channelsSide, messsagesCH } from '../channel/outils';
import { DmService } from '../dm/dm.service';
import { joinChannel, resJoinChannel } from '../dto/joinChannelDto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { changeNameDto, changeOwnerDto, changePassDto, changeTypeDto, changepicDto } from '../dto/changePramCH.dto';
import { banUserDto, kickUserDto, muteUserDto } from '../dto/blacklist.dto';
import { RequestType } from '@prisma/client';


@WebSocketGateway({ 
	namespace: 'chatGateway', cors: {
	origin: process.env.FrontendHost,
	allowedHeaders: ['token'],
	credentials: true
} })

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
	private readonly dmSide: dmsSide[] = [];
	private readonly channelSide: channelsSide[] = [];
	private readonly membershipCH: channelSidebar[] = [];
	private readonly dmMessages: dmMessages[] = [];
	private readonly chMessages: messsagesCH[] = [];

	async	handleConnection(@ConnectedSocket() client: Socket)
	{
		try
		{
			const token: string = client.handshake.headers.token as string;
			const payload = await this.jwtService.verifyAsync(token, { secret: process.env.jwtsecret })
			const user = await this.userService.findOneById(payload.sub);
			client.data.user = user;
			console.log(`------ coonect: ${user.nickname} ------`);
			this.usersSockets.push({userId: user.id, socket: client});
			client.emit('userConnection', `${client.data.user.nickname} is connected`);
			await this.Outils.pushMutedUsers();
		}
		catch (error)
		{
			console.error('Error<connection>: ', error.message);
			client.disconnect();
		}
	}
		
	async handleDisconnect(@ConnectedSocket() client: Socket)
	{
		try
		{
			console.log(`------ User disconnect ------`);
			client.disconnect();
		}
		catch (error)
		{
			console.error('Error<disconnect>: ', error.message);
		}
	}

	@SubscribeMessage('creatChannel')
	async	creatChannel(@MessageBody() data: creatChannel, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, creatChannel);
			const owner = client.data.user.nickname;
			if (data.name.length > 10 || data.name.length < 1) {
				throw new BadRequestException(`Invalid channel name.`);
			}
			if ((await this.Outils.isChannelExist(data.name))) {
				throw new BadRequestException(`${data.name} name is allocated.`);
			}
			const newChannel = await this.channelService.creatChannel(data, owner);
			const buffer: channelsSide = {};
			buffer.channelName = newChannel.name;
			buffer.channelPicture = newChannel.picture;
			buffer.channelType = newChannel.type;
			buffer.lastMsg = '';
			buffer.userRole = 'OWNER';
			client.emit('creatDone', buffer);
		}
		catch (error)
		{
			console.error('Error<creatChannel>:', error.message);
			client.emit('failed', 'failed to create a new channel.');
		}
	}

	@SubscribeMessage('joinChannel')
	async	AddUser2Channel(@MessageBody() data: joinChannel,  @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, joinChannel);
			const user = client.data.user;
			const {channelName, password} = data;
			const addUser = await this.channelService.joinChannel(channelName, user.nickname, password);
			if (addUser[0] === 'PRIVATE') {
				const ownerId = await this.DmOutils.getUserIdByName(addUser[1]);
				const ownerSocket = this.usersSockets.find(user => user.userId === ownerId);
				const checkRequest = await this.prisma.request.findUnique({
					where: {
						channelName,
						typeOfRequest: 'JOINCHANNEL',
						senderId: user.id,
						userId: ownerId
					},
				});
				if (checkRequest) {
					throw new UnauthorizedException('Only one request accepted for channel.');
				}
				const reqID = await this.userService.generateRequest(user.id, ownerId, RequestType.JOINCHANNEL, false, channelName);
				if (!ownerSocket) {
					return;
				}
				const notifData = await this.userService.generateNotifData(reqID);
				ownerSocket.socket.emit('notifHistory', notifData);
				client.emit('notification', 'request to join channel send to owner.');
			}
		}
		catch (error)
		{
			console.error('Error<joinChannel>: ', error.message);
			if (error instanceof UnauthorizedException) {
				client.emit('failed', error.message);
			} else {
				client.emit('failed', 'failed to join channel.');
			}
		}
	}

	@SubscribeMessage('responseJoin')
	async	ResponseJoinChannel(@MessageBody() data: resJoinChannel,  @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, resJoinChannel);
			const {channelName, user, value, requestId} = data;
			const checkOwner = await this.Outils.getChannelOwner(channelName);
			if (checkOwner !== client.data.user.nickname) {
				throw new ForbiddenException(`Forbidden action.`);
			}
			const checkRequest = await this.prisma.request.findUnique({
				where: {
					id: requestId
				},
			});
			if (!checkRequest) {
				throw new ForbiddenException('forbidden action.');
			}
			const resUserId = await this.DmOutils.getUserIdByName(user);
			const userSocket = this.usersSockets.find(user => user.userId === resUserId);
			if (!userSocket) {
				return;
			}
			if (value) {
				await this.prisma.channel.update({
					where: { name: channelName },
					data: {
						users: {
							connect: { nickname: user },
						},
					},
				});
				userSocket.socket.emit('notification', `Request to join ${channelName} got accepted`);
			}
			else {
				userSocket.socket.emit('notification', `Request to join ${channelName} got rejected`);
			}
			await this.prisma.request.delete({
				where: {
					id: requestId
				},
			});
		}
		catch (error)
		{
			console.error('Error<resJoinChannel>: ', error.message);
			client.emit('failed', error.message);
		}
	}

	@SubscribeMessage('sendMsgCH')
	async	sendMessageCh(@MessageBody() data: creatMessageCh, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, creatMessageCh);
			const {channelId, content} = data;
			const user =  client.data.user.nickname;
			const isUserInBlacklist = await this.Outils.isUserInBlacklist(channelId, user);
			if (isUserInBlacklist) {
				throw new UnauthorizedException(`you are not allowed to send message`);
			}
			const message = await this.channelService.creatMessageChannel(channelId, user, content);
			const Id = await this.Outils.getChannelIdByName(channelId);
			for (const user  of this.usersSockets) {
				//check blocked user
				user.socket.join(Id);
			}
			this.server.to(Id).emit('messageDone', message);
			for (const user  of this.usersSockets) {
				user.socket.leave(Id);
			}
		}
		catch (error)
		{
			console.error('Error<sendMsgCH>: ', error.message);
			client.emit('failed', 'failed to send message channel.');
		}
	}

	@SubscribeMessage('sendMsgDM')
	async	handleSendMessageDm(@MessageBody() data: sendMessageDm, @ConnectedSocket() client: Socket)
	{
		try
		{
			// check if i'm blocked by this users
			await  this.DmOutils.validateDtoData(data, sendMessageDm);
			const {receiver, content} = data;
			const user = client.data.user;
			console.log('user: ', user.nickname);
			const user2Id = await this.DmOutils.getUserIdByName(receiver);
			let dmId = await this.DmOutils.getDmIdby2User(user.id, user2Id);
			if (dmId === null) {
				await this.DmService.creatDMchat(user.id, user2Id);
				dmId = await this.DmOutils.getDmIdby2User(user.id, user2Id);
			}
			console.log('msg: ', content);
			if (content) {
				const message = await this.DmService.creatMessageDm(dmId, user.nickname, content);
				await this.DmOutils.updateDmupdatedAt(dmId, message.createdAt);
				const receiverSocket = this.usersSockets.find(user => user.userId === user2Id);
				if (receiverSocket) {
					client.join(dmId);
					receiverSocket.socket.join(dmId);
					this.server.to(dmId).emit('messageDone', message);
					client.leave(dmId);
					receiverSocket.socket.leave(dmId);
				}
			}
		}
		catch (error)
		{
			console.error('Error<sendMessageDM>', error.message);
			client.emit('failed', 'failed to send DM.');
		}
	}
	
	@SubscribeMessage('leaveChannel')
	async	handleLeaveChannel(@MessageBody() channelName: string, @ConnectedSocket() client: Socket)
	{
		try
		{
			const user = client.data.user.nickname;
			await this.channelService.leaveChannel(channelName, user);
			client.emit('notification', {msg: 'you are now out of this channel'});
		}
		catch(error)
		{
			console.error('Error<leaveChannel>: ', error.message);
			client.emit('failed', { error: 'failed to leave channel.' });
		}
	}

	@SubscribeMessage('kickUser')
	async	KickUser(@MessageBody() data: kickUserDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, kickUserDto);
			const {channelName, user2kick} = data;
			const admin = client.data.user.nickname;
			await this.channelService.kickUser(channelName, admin, user2kick);
			client.emit('kickDone', {msg: `${user2kick} is kicked.`});
			// emit an notification to the user kicked and to all chanel users
		}
		catch(error)
		{
			console.error('Error<kickUser>: ', error.message);
			client.emit('failed', { error: `failed to kick user.`});
		}
	}
	
	@SubscribeMessage('banUser')
	async	BanUser(@MessageBody() data: banUserDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, banUserDto);
			const {channelName, user2ban} = data;
			const admin = client.data.user.nickname;
			await this.channelService.banUser(channelName, admin, user2ban);
			client.emit('banDone', {msg: `${user2ban} is baned.`});
			// emit an notification to the user baned and to all chanel users
		}
		catch(error)
		{
			console.error('Error<banUser>: ', error.message);
			client.emit('failed', { error: 'failed to ban user.' });
		}
	}
	
	@SubscribeMessage('muteUser')
	async	MuteUser(@MessageBody() data: muteUserDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, muteUserDto);
			const {channelName, user2mute, expirationTime} = data;
			const admin = client.data.user.nickname;
			await this.channelService.muteUser(channelName, admin, user2mute, expirationTime);
			client.emit('muteDone', {msg: `${user2mute} is muteed.`});
			// emit an notification to the user muted and to all chanel users
		}
		catch(error)
		{
			console.error('Error<muteUser>: ', error.message);
			client.emit('failed', { error: 'failed to mute user.' });
		}
	}

	@SubscribeMessage('changeOwnerCH')
	async	ChangeChannelOwner(@MessageBody() data: changeOwnerDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, changeOwnerDto);
			const {channelName, newOwner} = data;
			const owner = client.data.user.nickname;
			await this.channelService.changeOwnerOfChannel(channelName, owner, newOwner);
			client.emit('ownerDone', 'owner has changed');
			// emit notification to inform user he is the new owner inside channel | serverside
		}
		catch(error)
		{
			console.error('Error<changeOwnerCH>: ', error.message);
			client.emit('failed', { error: 'failed to change channel owner.' });
		}
	}

	@SubscribeMessage('changeTypeCH')
	async	ChangeChannelType(@MessageBody() data: changeTypeDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, changeTypeDto);
			const {channelName, newType, password} = data;
			const owner = client.data.user.nickname;
			await this.channelService.changeChannelType(channelName, owner, newType, password);
			// emit notification inside channel : `New type is seted to: ${newType}.` | serverside
		}
		catch (error)
		{
			console.error('Error<changeTypeCH>: ', error.message);
			client.emit('failed', `failed to change channel type.`);
		}
	}
	
	@SubscribeMessage('changeNameCH')
	async	ChangeChannelName(@MessageBody() data: changeNameDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, changeNameDto);
			const {channelName, newName} = data;
			const owner = client.data.user.nickname;
			await this.channelService.changeChannelName(channelName, owner, newName);
			// emit notification inside channel : `New channel name seted.` | serverside
		}
		catch (error)
		{
			console.error('Error<changeNameCH>: ', error.message);
			client.emit('failed', `failed to change chnnel name.`);
		}
	}
	
	@SubscribeMessage('changePassCH')
	async	ChangeChannelPass(@MessageBody() data: changePassDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, changePassDto);
			const {channelName, newPassword} = data;
			const owner = client.data.user.nickname;
			await this.channelService.changeChannelPass(channelName, owner, newPassword);
			// emit notification inside channel : `New password is seted.` | serverside
		}
		catch (error)
		{
			console.error('Error<changePassCH>: ', error.message);
			client.emit('failed', `failed to change channel password.`);
		}
	}

	@SubscribeMessage('changePicCH')
	async	ChangeChannelPicture(@MessageBody() data: changepicDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, changepicDto);
			const {channelName, newPicture} = data;
			const owner = client.data.user.nickname;
			await this.channelService.changeChannelPicture(channelName, newPicture, owner);
			// emit notification inside channel : 'New picture is seted.' | serverside
		}
		catch (error)
		{
			console.error('Error<changePicCH>: ', error.message);
			client.emit('failed', 'failed to change picture.');
		} 
	}

	@SubscribeMessage('getChSidebar')
	async	getChannelSidebar(@MessageBody() channelName: string, @ConnectedSocket() client: Socket)
	{
		try
		{
			const user = client.data.user.nickname;
			if (!(await this.Outils.isUserInChannel(channelName, user))) {
				throw new UnauthorizedException('Forbidden action.');
			}
			const channel = await this.Outils.findChannelByName(channelName);
			for (const user of channel.users) {
				let buffer: channelSidebar = {};
				const role = (await this.Outils.getUserChannelRole(channel.name, user.nickname) 
				=== 'MEMBER') ? 'MEMBER': 'ADMIN';
				buffer.username = user.nickname;
				buffer.userPicture = user.profilePic;
				buffer.channelRole = role;
				this.membershipCH.push(buffer);
			}
			client.emit('channelSidebar', this.membershipCH);
			this.membershipCH.length = 0;
		}
		catch (error)
		{
			console.error('Error<getChSidebar>: ', error.message);
			client.emit('failed', 'Faild to get channel sidebar');
		}
	}

	@SubscribeMessage('getUserChannels')
	async	GetUserChannels(@ConnectedSocket() client: Socket)
	{
		try
		{
			const user = client.data.user.nickname;
			const userChannels = await this.channelService.getUserChannels(user);
			for(const channel of userChannels) {
				let buffer: channelsSide = {};
				buffer.channelName = channel.name;
				buffer.channelPicture = channel.picture;
				buffer.userRole = await this.Outils.getUserChannelRole(channel.name, user);
				buffer.lastMsg = channel.messages[0]?.content;
				buffer.channelType = channel.type;
				this.channelSide.push(buffer);
			}
			client.emit('UserChannels', this.channelSide);
			this.channelSide.length = 0;
		}
		catch(error)
		{
			console.error('Error<getUserChannels>: ', error.message);
			client.emit('failed', { error: 'failed to get user channels.' });
		}
	}

	@SubscribeMessage('getUserDms')
	async	GetUserDm(@ConnectedSocket() client: Socket)
	{
		try {
			let picture, name, lastMsg, status, receiver;
			const user = client.data.user.nickname;
			const ls = await this.DmOutils.getBlockedUsers(user);
			const userDms = await this.DmService.getUserDms(user);
			// console.log('content: ', userDms)
			for (const dm of userDms) {
				name = dm.members[0].nickname;
				picture = dm.members[0].profilePic;
				if (user === dm.members[0].nickname) {
					name = dm.members[1].nickname;
					picture = dm.members[1].profilePic;
				}
				// console.log('content: ', dm.messages[0])
				lastMsg = dm.messages[0]?.content || '';
				receiver = dm.members[0].nickname === user ? dm.members[1].nickname: user;
				status = (this.DmOutils.isInBlockedList(receiver, 
					[...ls.BlockedBy, ...ls.usersBlocked]) === true ? 'BOLOCKED':'ACTIVE');
				this.dmSide.push({name, lastMsg, picture, status});	
			}
			client.emit('UserDms', this.dmSide);
			this.dmSide.length = 0;
		}
		catch(error) {
			this.DmOutils.Error(client, 'getUserDms', error.message, 'get user DMs failed');
		}
	}
	
	@SubscribeMessage('searchChannel')
	async	searchChannels(@MessageBody() channelName: string, @ConnectedSocket() client: Socket)
	{
		try {
			const channels = await this.channelService.searchChannels(channelName);
			for (const channel of channels) {
				const buffer: channelsSide = {};
				buffer.channelName = channel.name;
				buffer.channelPicture = channel.picture;
				buffer.channelType = channel.type;
				buffer.userRole = 'none';
				buffer.lastMsg = 'join channel to see messages';
				const isMember = await this.Outils.isUserInChannel(channelName, client.data.user.nickname);
				if (isMember) {
					buffer.userRole = await this.Outils.getUserChannelRole(channel.name, client.data.user.nickname);
					buffer.lastMsg = channel.messages[0]?.content || '';
				}
				this.channelSide.push(buffer);
			}
			client.emit('queryChannels', this.channelSide);
			this.channelSide.length = 0;
		}
		catch (error) {
			this.DmOutils.Error(client, 'searchChannel', error.message, 'find channel failed');
		}
	}
	
	@SubscribeMessage('getMessagesCH')
	async	getMessagesCHannel(@MessageBody() data: getMessagesCH, @ConnectedSocket() client: Socket)
	{
		try {
			await this.DmOutils.validateDtoData(data, getMessagesCH);
			const user = client.data.user;
			const allMessages = await this.channelService.getMessagesCH(user.nickname, data.channelName);
			for (const msg of allMessages) {
				const buffer: messsagesCH = {};
				buffer.id = msg.id;
				buffer.sender = msg.sender.nickname;
				buffer.picture = msg.sender.profilePic;
				buffer.message = msg.content;
				buffer.time = this.DmOutils.dateTime2String(msg.createdAt);
				this.chMessages.push(buffer);
			}
			client.emit('messagesCH', this.Outils.onePic4msgSender(this.chMessages))
			this.chMessages.length = 0;
		}
		catch (error) {
			this.DmOutils.Error(client, 'getMessagesCH', error.message, 'get channel messages failed');
		}
	}

	@SubscribeMessage('getMessagesDM')
	async	getMessagesDM(@MessageBody() data: getMessagesDm, @ConnectedSocket() client: Socket)
	{
		try {
			await this.DmOutils.validateDtoData(data, getMessagesDm);
			const allMessages = await this.DmService.getDmMessages(data.dmId);
			for (const chat of allMessages.messages) {
				const buffer: dmMessages = {};
				buffer.id = chat.id;
				buffer.sender = chat.sender.nickname;
				buffer.message = chat.content;
				buffer.time = this.DmOutils.dateTime2String(chat.createdAt);
				this.dmMessages.push(buffer);
			}
			client.emit('messagesDM', this.dmMessages);
			this.dmMessages.length = 0;
		}
		catch (error) {
			this.DmOutils.Error(client, 'getMessagesDM', error.message, 'get DM messages failed');
		}
	}
}
