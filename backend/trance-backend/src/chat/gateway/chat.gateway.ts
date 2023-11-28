import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChannelService } from '../channel/channel.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private channelService: ChannelService
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
	   client.emit('userConnection', {msg: `a new user is connected ${client.id}`});
  }
    
	async handleDisconnect(@ConnectedSocket() client: Socket)
	{
    	console.log('disconnect');
		client.disconnect();
	}
	
	@SubscribeMessage('creatChannel')
  	async	handleChannelCreated(@MessageBody() data:any, @ConnectedSocket() client: Socket)
	{
    	try
		{
			const newChannel = await this.channelService.creatChannel(data);
			console.log('from new repo', newChannel);
			client.emit('channelCreated', newChannel);
		}
    	catch (error)
    	{
      		console.error('Error creating channel:', error);
      		throw new Error('Failed to create a new channel.');
    	}
	}
}
