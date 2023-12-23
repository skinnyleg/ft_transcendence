import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from '../channel/channel.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { creatChannel } from '../dto/creat-channel.dto';
import { BadRequestException, ForbiddenException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { DmOutils, dmMessages, dmsSide } from '../dm/dm.outils';
import { creatMessageCh, getMessagesCH, getMessagesDm, sendMessageDm } from '../dto/messages.dto';
import { ChannelOutils, channelSidebar, channelsSide, messsagesCH, notif2user } from '../channel/outils';
import { DmService } from '../dm/dm.service';
import { joinChannel, resJoinChannel } from '../dto/joinChannelDto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { changeNameDto, changeAdminsDto, changePassDto, changeTypeDto, changepicDto, stringDto } from '../dto/changePramCH.dto';
import { banUserDto, kickUserDto, muteUserDto } from '../dto/blacklist.dto';
import { RequestType } from '@prisma/client';


@WebSocketGateway({ 
	namespace: 'chatGateway', cors: {
	origin: process.env.FrontendHost,
	allowedHeaders: ['token'],
	credentials: true
} })

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {

	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly channelService: ChannelService,
		private readonly Outils: ChannelOutils,
		private readonly DmOutils: DmOutils,
		private readonly DmService: DmService,
		private readonly prisma: PrismaService,
	){}

	@WebSocketServer()
	server: Server;

	private readonly usersSockets: {userId: string, socket: any}[] = [];
	// private readonly dmSide: dmsSide[] = [];
	// private channelSide: channelsSide[] = [];
	// private membershipCH: channelSidebar[] = [];
	// private dmMessages: dmMessages[] = [];
	// private chMessages: messsagesCH[] = [];


	async onModuleInit() {
		try
		{
			console.log('------ WebSocket Gateway started ------');
			await this.Outils.pushMutedUsers();
			await this.Outils.MuteExpiration();
		}
		catch (error) {
			console.log('error<onModuleInit>: ', error.message);
		}
	}

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
		}
		catch (error) {
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
		catch (error) {
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
			if (data.name.length > 10 || data.name.length < 1)
				throw new BadRequestException(`Invalid channel name`);
			if ((await this.Outils.isChannelExist(data.name)))
				throw new BadRequestException(`${data.name} name is taken`);
			const newChannel = await this.channelService.creatChannel(data, owner);
			const buffer: channelsSide = {};
			buffer.channelId = newChannel.id;
			buffer.channelName = newChannel.name;
			buffer.channelPicture = newChannel.picture;
			buffer.userRole = 'OWNER';
			buffer.lastMsg = '';
			buffer.channelType = newChannel.type;
			client.emit('channelDone', buffer);
		}
		catch (error) {
			this.DmOutils.Error(client, 'creatChannel', error, 'create new channel failed');
		}
	}

	@SubscribeMessage('getDataCH')
	async	channelInformation(@MessageBody() data: stringDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, stringDto);
			const user = client.data.user.nickname;
			const { channelName } = data;
			const channel = await this.Outils.findChannelByName(channelName);
			let buffer: channelsSide = {};
			buffer.channelId = channel.id;
			buffer.channelName = channel.name;
			buffer.channelPicture = channel.picture;
			const isMember = await this.Outils.isUserInChannel(channelName, user);
			buffer.userRole = isMember === false ? 'none' : (await this.Outils.getUserChannelRole(channel.name, user));
			const chUsers = (await this.channelService.getChannelUsers(channelName)).map(userCh => userCh.nickname);
			buffer.lastMsg = chUsers.slice(0, 3).join(', ');
			buffer.channelType = channel.type;
			client.emit('channelData', buffer);
		}
		catch (error) {
			this.DmOutils.Error(client, 'channelInfo', error, 'get channel data failed');
		}
	}

	@SubscribeMessage('joinChannel')
	async	joinChannel(@MessageBody() data: joinChannel,  @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, joinChannel);
			const user = client.data.user;
			const addUser = await this.channelService.joinChannel(data.channelName, user.nickname, data.password);
			if (addUser[0] === 'PRIVATE') {
				const ownerId = await this.DmOutils.getUserIdByName(addUser[1]);
				const ownerSocket = this.usersSockets.find(user => user.userId === ownerId);
				await this.Outils.checkRequest(data, ownerId, user.id);
				const reqID = await this.userService.generateRequest(user.id, ownerId, 
					RequestType.JOINCHANNEL, false, data.channelName);
				if (ownerSocket)
					ownerSocket.socket.emit('notifHistory', (await this.userService.generateNotifData(reqID)));
				return client.emit('notification', 'request to join channel send to owner.');
			}
			const notif2users: notif2user = {};
			notif2users.channelName = data.channelName;
			notif2users.admin = user.nickname;
			notif2users.server = this.server;
			notif2users.usersSockets = this.usersSockets; 
			notif2users.notif = `${user.nickname} has joined`;
			notif2users.user2notify = user.nickname;
			await this.channelService.emitNotif2channelUsers(notif2users, ['joinDone', 'refreshSide']);
		}
		catch (error) {
			this.DmOutils.Error(client, 'joinChannel', error, 'join channel failed');
		}
	}

	@SubscribeMessage('responseJoin')
	async	ResponseJoinChannel(@MessageBody() data: resJoinChannel,  @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, resJoinChannel);
			const { channelName, user, value, requestId } = data;
			const checkOwner = await this.Outils.getChannelOwner(channelName);
			if (checkOwner !== client.data.user.nickname)
				throw new ForbiddenException(`Forbidden action`);
			const isUserInChannel =  await this.Outils.isUserInChannel(channelName, user);
			if (isUserInChannel)
				throw new UnauthorizedException(`he is already a member of ${channelName}.`);
			const isClean = await this.Outils.isUserInBlacklist(channelName, user);
			if(isClean)
				throw new UnauthorizedException(`he is blacklisted in ${channelName}.`);
			const checkRequest = await this.prisma.request.findUnique({
				where: { id: requestId },
			});
			if (!checkRequest) 
				throw new ForbiddenException('forbidden action.');
			if (value) {
				await this.prisma.channel.update({
					where: { name: channelName },
					data: { users: { connect: { nickname: user } } },
				});
			}
			await this.prisma.request.delete({
				where: { id: requestId },
			});
			const resUserId = await this.DmOutils.getUserIdByName(user);
			const userSocket = this.usersSockets.find(user => user.userId === resUserId);
			if (!userSocket)
				return;
			if (value) {
				userSocket.socket.emit('notification', `Request to join ${channelName} got accepted`);
				const notif2users: notif2user = {};
				notif2users.channelName = data.channelName;
				notif2users.admin = client.data.user.nickname;
				notif2users.server = this.server;
				notif2users.usersSockets = this.usersSockets; 
				notif2users.notif = `${user} has joined`;
				notif2users.user2notify = user;
				await this.channelService.emitNotif2channelUsers(notif2users, ["joinDone", 'refreshSide']);
			}
			else
				userSocket.socket.emit('notification', `Request to join ${channelName} got rejected`);
		}
		catch (error) {
			this.DmOutils.Error(client, 'responseJoin', error, 'response to join channel failed');
		}
	}

	@SubscribeMessage('setAdmin')
	async	setAdmin2Channel(@MessageBody() data: changeAdminsDto,  @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, changeAdminsDto);
			const {channelName, newAdmin} = data;
			const owner = client.data.user.nickname;
			await this.channelService.setAdmin2Channel(channelName, owner, newAdmin);
			const notif2users: notif2user = {channelName};
			notif2users.admin = owner;
			notif2users.server = this.server;
			notif2users.usersSockets = this.usersSockets; 
			notif2users.notif = `${newAdmin} added to channel admins`;
			notif2users.user2notify = newAdmin;
			await this.channelService.emitNotif2channelUsers(notif2users, ['refreshSide','newAdmin'], {channelName});
		}
		catch (error) {
			this.DmOutils.Error(client, 'setAdmin', error, 'set admin to channel failed');
		}
	}

	@SubscribeMessage('sendMsgCH')
	async	sendMessageCh(@MessageBody() data: creatMessageCh, @ConnectedSocket() client: Socket)
	{
		//todo send notif2user in case not connected 'you have unseen messqges' 
		try
		{
			await  this.DmOutils.validateDtoData(data, creatMessageCh);
			const {channelName, content} = data;
			const user =  client.data.user;
			const isUserInBlacklist = await this.Outils.isUserInBlacklist(channelName, user.nickname);
			if (isUserInBlacklist)
				throw new UnauthorizedException(`you are not allowed to send message`);
			const channelId = await this.Outils.getChannelIdByName(channelName);
			const message = await this.channelService.creatMessageChannel(channelName, user.nickname, content);
			const allowedUsers = await this.channelService.allowedUsersCH(channelName, user, this.usersSockets)
			for (const userSocket  of allowedUsers)
				userSocket.socket.join(channelId);
			const buffer: messsagesCH = {};
			buffer.channelId = channelName;
			buffer.messageId = message.id;
			buffer.sender = user.nickname;
			buffer.picture = user.profilePic;
			buffer.message = message.content;
			buffer.time = this.DmOutils.dateTime2String(message.createdAt);
			this.server.to(channelId).emit('messageDoneCH', buffer);
			for (const userSocket  of allowedUsers)
				userSocket.socket.leave(channelId);
		}
		catch (error) {
			this.DmOutils.Error(client, 'sendMsgCH', error.message, 'send message to channel failed');
		}
	}

	@SubscribeMessage('sendMsgDM')
	async	handleSendMessageDm(@MessageBody() data: sendMessageDm, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, sendMessageDm);
			const user = client.data.user;
			const receId = await this.DmOutils.getUserIdByName(data.receiver);
			const receiverSocket = this.usersSockets.find(user => user.userId === receId);
			const { dmId, receiverId } = await this.DmService.generateDm(data.receiver, user.id, receiverSocket.socket);
			const blockedList = await this.DmOutils.getBlockedUsers(user.nickname);
			if (blockedList.find((blockUser => blockUser === receiverId)))
				return client.emit('notification', `${data.receiver} is blocked`);
			if (data.content) {
				const message = await this.DmService.creatMessageDm(dmId, user.nickname, data.content);
				await this.DmOutils.updateDmupdatedAt(dmId, message.createdAt);
				const buffer = this.DmOutils.fillDmsBuffer(message, user.nickname, dmId);
				if (receiverSocket) {
					client.join(dmId);
					receiverSocket.socket.join(dmId);
					this.server.to(dmId).emit('messageDoneDM', buffer);
					receiverSocket.socket.leave(dmId);
					client.leave(dmId);
				}
			}
		}
		catch (error) {
			this.DmOutils.Error(client, 'sendMsgDM', error, 'send DM failed');
		}
	}
	
	@SubscribeMessage('leaveChannel')
	async	leaveChannel(@MessageBody() data: stringDto, @ConnectedSocket() client: Socket)
	{
		try {
			await this.DmOutils.validateDtoData(data, stringDto);
			const { channelName } = data;
			const user = client.data.user;
			await this.channelService.leaveChannel(channelName, user.nickname);
			const notif2users: notif2user = {channelName};
			notif2users.server = user.nickname;
			notif2users.server = this.server;
			notif2users.usersSockets = this.usersSockets; 
			notif2users.notif = `${user.nickname} left`;
			notif2users.user2notify = user.nickname;
			await this.channelService.emitNotif2channelUsers(notif2users, ['outDone', 'refreshSide']);
		}
		catch(error) {
			this.DmOutils.Error(client, 'leaveChannel', error, 'leave channel failed');
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
			if (user2kick === admin)
				throw new ForbiddenException('you can\'t kick your self');
			await this.channelService.kickUser(channelName, admin, user2kick);
			const notif2users: notif2user = {channelName, admin};
			notif2users.server = this.server;
			notif2users.usersSockets = this.usersSockets; 
			notif2users.notif = `${user2kick} got kicked`;
			notif2users.user2notify = user2kick;
			await this.channelService.emitNotif2channelUsers(notif2users, ['outDone', 'refreshSide']);
		}
		catch(error) {
			this.DmOutils.Error(client, 'kickUser', error, 'kick user failed');
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
			if (user2ban === admin)
				throw new ForbiddenException('you can\'t ban your self');
			await this.channelService.banUser(channelName, admin, user2ban);
			const notif2users: notif2user = {channelName, admin};
			notif2users.server = this.server;
			notif2users.usersSockets = this.usersSockets; 
			notif2users.notif = `${user2ban} got banned`;
			notif2users.user2notify = user2ban;
			await this.channelService.emitNotif2channelUsers(notif2users, ['outDone', 'refreshSide']);
		}
		catch(error) {
			this.DmOutils.Error(client, 'banUser', error, 'ban user failed');
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
			if (user2mute === admin)
				throw new ForbiddenException('you can\'t mute yourself');
			await this.channelService.muteUser(channelName, admin, user2mute, expirationTime);
			const notif2users: notif2user = {channelName, admin};
			notif2users.server = this.server;
			notif2users.usersSockets = this.usersSockets; 
			notif2users.notif = `${user2mute} got muted`;
			notif2users.user2notify = user2mute;
			await this.channelService.emitNotif2channelUsers(notif2users, ['muteDone', 'refreshSide']);
		}
		catch(error) {
			this.DmOutils.Error(client, 'muteUser', error, 'mute user failed');
		}
	}

	@SubscribeMessage('changeOwnerCH')
	async	ChangeChannelOwner(@MessageBody() data: changeAdminsDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, changeAdminsDto);
			const {channelName, newAdmin} = data;
			const owner = client.data.user.nickname;
			await this.channelService.changeOwnerOfChannel(channelName, owner, newAdmin);
			const notif2users: notif2user = {channelName};
			notif2users.admin = owner;
			notif2users.server = this.server;
			notif2users.usersSockets = this.usersSockets; 
			notif2users.notif = `${newAdmin} is the new owner`;
			notif2users.user2notify = newAdmin;
			await this.channelService.emitNotif2channelUsers(notif2users, ['refreshSide','newOwner'], {channelName});
		}
		catch(error) {
			this.DmOutils.Error(client, 'changeOwnerCH', error, 'change channel owner failed');
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
		}
		catch (error) {
			this.DmOutils.Error(client, 'changeTypeCH', error, 'change channel type failed');
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
			const notif2users: notif2user = {channelName: newName};
			notif2users.admin = owner;
			notif2users.server = this.server;
			notif2users.usersSockets = this.usersSockets; 
			notif2users.notif = `${newName} is the new name of channel`;
			notif2users.user2notify = owner;
			await this.channelService.emitNotif2channelUsers(notif2users, ['', 'newName']);
		}
		catch (error) {
			this.DmOutils.Error(client, 'changeNameCH', error, 'change channel name failed');
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
		}
		catch (error) {
			this.DmOutils.Error(client, 'changePassCH', error, 'change channel password failed');
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
			client.emit('allowPicture');
		}
		catch (error) {
			this.DmOutils.Error(client, 'changePicCH', error, 'change channel picture failed');
		} 
	}

	@SubscribeMessage('refreshPicture')
	async	refreshPicture(@MessageBody() data: stringDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, stringDto);
			const {channelName} = data;
			const owner = client.data.user.nickname;
			await this.channelService.changeChannelPicture(channelName, null, owner);
			const notif2users: notif2user = {channelName};
			notif2users.admin = owner;
			notif2users.server = this.server;
			notif2users.usersSockets = this.usersSockets; 
			notif2users.notif = `new channel picture`;
			notif2users.user2notify = '';
			await this.channelService.emitNotif2channelUsers(notif2users, ['', 'PicDone'], {channelName});
		}
		catch (error) {
			this.DmOutils.Error(client, 'refreshPicture', error, 'refresh channel picture failed');
		} 
	}

	@SubscribeMessage('getChSidebar')
	async	getChannelSidebar(@MessageBody() data: stringDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, stringDto);
			const {channelName} = data;
			const user = client.data.user.nickname;
			if (!(await this.Outils.isUserInChannel(channelName, user)))
				throw new UnauthorizedException('Forbidden action.');
			const channel = await this.Outils.findChannelByName(channelName);
			const membershipCH: channelSidebar[] = [];
			for (const user of channel.users) {
				let buffer: channelSidebar = {};
				buffer.username = user.nickname;
				buffer.userId = user.id;
				buffer.userPicture = user.profilePic;
				buffer.channelRole = await this.Outils.getUserChannelRole(channel.name, user.nickname);
				membershipCH.push(buffer);
			}
			client.emit('channelSidebar', membershipCH);
		}
		catch (error) {
			this.DmOutils.Error(client, 'getChSidebar', error, 'get channel sidebar failed');
		}
	}

	@SubscribeMessage('getUserChannels')
	async	GetUserChannels(@ConnectedSocket() client: Socket)
	{
		try
		{
			const user = client.data.user.nickname;
			const userChannels = await this.channelService.getUserChannels(user);
			const channelSide: channelsSide[] = [];
			for(const channel of userChannels) {
				let buffer: channelsSide = {};
				buffer.channelId = channel.id;
				buffer.channelName = channel.name;
				buffer.channelPicture = channel.picture;
				buffer.userRole = await this.Outils.getUserChannelRole(channel.name, user);
				buffer.lastMsg = channel.messages[0]?.content || '';
				buffer.channelType = channel.type;
				channelSide.push(buffer);
			}
			client.emit('UserChannels', channelSide);
		}
		catch(error) {
			this.DmOutils.Error(client, 'getUserChannels', error, 'get user channels failed');
		}
	}

	@SubscribeMessage('getUserDms')
	async	GetUserDm(@ConnectedSocket() client: Socket)
	{
		try
		{
			let picture, name, lastMsg, status, receiver: string;
			const user = client.data.user;
			const ls = await this.DmOutils.getBlockedUsers(user.nickname);
			const userDms = await this.DmService.getUserDms(user.nickname);
			const dmSide: dmsSide[] = [];
			for (const dm of userDms) {
				name = dm.members[0].nickname;
				picture = dm.members[0].profilePic;
				if (user.nickname === dm.members[0].nickname) {
					name = dm.members[1].nickname;
					picture = dm.members[1].profilePic;
				}
				lastMsg = dm.messages[0]?.content || '';
				receiver = (dm.members[0].id === user.id) ? dm.members[1].id : dm.members[0].id;
				status = (this.DmOutils.isInBlockedList(receiver, ls) === true ? 'BLOCKED' : 'ACTIVE');
				dmSide.push({dmId: dm.id, name, lastMsg, picture, status});	
			}
			client.emit('userDms', dmSide);
		}
		catch(error) {
			this.DmOutils.Error(client, 'getUserDms', error, 'get user DMs failed');
		}
	}
	
	@SubscribeMessage('searchChannel')
	async	searchChannels(@MessageBody() data: stringDto, @ConnectedSocket() client: Socket)
	{
		try
		{
			await  this.DmOutils.validateDtoData(data, stringDto);
			const {channelName} = data;
			const channels = await this.channelService.searchChannels(channelName);
			const channelSide: channelsSide[] = [];
			for (const channel of channels) {
				const buffer: channelsSide = {};
				buffer.channelId = channel.id;
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
				channelSide.push(buffer);
			}
			client.emit('queryChannels', channelSide);
		}
		catch (error) {
			this.DmOutils.Error(client, 'searchChannel', error, 'find channel failed');
		}
	}
	
	@SubscribeMessage('getMessagesCH')
	async	getMessagesCHannel(@MessageBody() data: getMessagesCH, @ConnectedSocket() client: Socket)
	{
		try
		{
			await this.DmOutils.validateDtoData(data, getMessagesCH);
			const user = client.data.user;
			const allMessages = await this.channelService.getMessagesCH(user.nickname, data.channelName);
			const chMessages: messsagesCH[] = [];
			for (const msg of allMessages) {
				const buffer: messsagesCH = {};
				buffer.messageId = msg.id;
				buffer.sender = msg.sender.nickname;
				buffer.picture = msg.sender.profilePic;
				buffer.message = msg.content;
				buffer.time = this.DmOutils.dateTime2String(msg.createdAt);
				chMessages.push(buffer);
			}
			client.emit('messagesCH', this.Outils.onePic4msgSender(chMessages))
		}
		catch (error) {
			this.DmOutils.Error(client, 'getMessagesCH', error, 'get channel messages failed');
		}
	}

	@SubscribeMessage('getMessagesDM')
	async	getMessagesDM(@MessageBody() data: getMessagesDm, @ConnectedSocket() client: Socket)
	{
		try
		{
			await this.DmOutils.validateDtoData(data, getMessagesDm);
			const allMessages = await this.DmService.getDmMessages(data.dmId);
			const dmMessages: dmMessages[] = [];
			for (const chat of allMessages.messages) {
				const buffer: dmMessages = 
				this.DmOutils.fillDmsBuffer(allMessages, client.data.user.nickname, data.dmId);
				// const buffer: dmMessages = {};
				// buffer.dmId = allMessages.id;
				// buffer.messageId = chat.id;
				// buffer.sender = chat.sender.nickname;
				// buffer.message = chat.content;
				// buffer.time = this.DmOutils.dateTime2String(chat.createdAt);
				dmMessages.push(buffer);
			}
			client.emit('messagesDM', dmMessages);
		}
		catch (error) {
			this.DmOutils.Error(client, 'getMessagesDM', error, 'get DM messages failed');
		}
	}
}
