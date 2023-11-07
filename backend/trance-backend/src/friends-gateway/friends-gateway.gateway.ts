import { WebSocketGateway } from '@nestjs/websockets';
import { FriendsGatewayService } from './friends-gateway.service';

@WebSocketGateway()
export class FriendsGatewayGateway {
  constructor(private readonly friendsGatewayService: FriendsGatewayService) {}
}
