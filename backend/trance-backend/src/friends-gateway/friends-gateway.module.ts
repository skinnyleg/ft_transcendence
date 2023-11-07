import { Module } from '@nestjs/common';
import { FriendsGatewayService } from './friends-gateway.service';
import { FriendsGatewayGateway } from './friends-gateway.gateway';

@Module({
  providers: [FriendsGatewayGateway, FriendsGatewayService],
})
export class FriendsGatewayModule {}
