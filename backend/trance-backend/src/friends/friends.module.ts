import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsGateway } from './friends.gateway';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DmService } from 'src/chat/dm/dm.service';
import { DmOutils } from 'src/chat/dm/dm.outils';

@Module({
	imports: [UserModule, PrismaModule],
  providers: [FriendsGateway, FriendsService, UserService, DmOutils, DmService],
})
export class FriendsModule {}
