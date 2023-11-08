import { WebSocketGateway } from '@nestjs/websockets';
import { FriendsService } from './friends.service';

@WebSocketGateway()
export class FriendsGateway {
  constructor(private readonly friendsService: FriendsService) {}
}
