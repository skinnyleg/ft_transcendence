import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from '../channel/channel.service';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { creatChannelDto } from '../dto/creat-channel.dto';

@WebSocketGateway({ namespace: 'chatGateway' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private channelService: ChannelService,
		private jwtService: JwtService,
		private userService: UserService,
	){}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('message')
	handleMessage(client: any, payload: any): string {
		return 'Hello world!';
	}

	async handleConnection(@ConnectedSocket() client: Socket)
	{
		console.log('coonect');
		// const token: string = client.handshake.headers.token as string;
		const token: string = client.handshake.headers.token as string;
		const payload = await this.jwtService.verifyAsync(token, { secret: process.env.jwtsecret })
		const user = await this.userService.findOneById(payload.sub);
		client.data.user = user;
		console.log('this is the client data: ', client.data);
		console.log('this is the token: ', token);
		client.emit('userConnection', {msg: `a new user is connected ${client.id}`});
	}
		
	async handleDisconnect(@ConnectedSocket() client: Socket)
	{
		console.log('disconnect');
		client.disconnect();
	}
	
	@SubscribeMessage('creatChannel')
  	async	handleChannelCreated(@MessageBody() data: creatChannelDto, @ConnectedSocket() client: Socket)
	{
    	try
		{
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

	
}
