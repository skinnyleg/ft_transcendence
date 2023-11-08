import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsGateway } from './friends.gateway';

@Module({
  providers: [FriendsGateway, FriendsService],
})
export class FriendsModule {}
