import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { FriendsService } from './friends.service';
import { Server, Socket } from 'socket.io';
import { Req } from '@nestjs/common';

@WebSocketGateway()
export class FriendsGateway {
  constructor(private readonly friendsService: FriendsService) {}
  @WebSocketServer()
  server: Server;


  async handleConnection(client: Socket, @Req() req) {
    // Update ussocket.handshake.auth.tokener status in the database

	console.log('client id = ', client.handshake.headers.token)
	await this.friendsService.getUser(client)
	// const id = getId(req);
	// console.log("user id == ", id)
    this.updateUserStatus(client.id, 'online');
    // Notify friends about the user's status
    this.notifyFriendsAboutStatusChange(client.id, 'online');
  }

  handleDisconnect(client: Socket) {
    // Update user status in the database
    this.updateUserStatus(client.id, 'offline');

    // Notify friends about the user's status
    this.notifyFriendsAboutStatusChange(client.id, 'offline');
  }

  // Update the user's status in the database
  updateUserStatus(userId: string, status: string) {
    // Use Prisma to update the status in the User model
    // prisma.user.update({
    //   where: { id: userId },
    //   data: { status },
    // });
  }

  // Notify friends about the user's status change
  notifyFriendsAboutStatusChange(userId: string, status: string) {
    // Send status updates to friends or subscribers
    // Iterate through the user's friends and emit status change events
    // You might have a UserFriends model to manage friend relationships
    // const friends = prisma.user.findUnique({ where: { id: userId } }).friends;
    // friends.forEach((friend) => {
    //   this.server.to(friend.id).emit('status-change', { userId, status });
    // });
  }
}
