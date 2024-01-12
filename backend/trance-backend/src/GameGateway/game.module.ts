import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { makeQueue, room } from './Queue.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendsService } from 'src/friends/friends.service';
import { FriendsModule } from 'src/friends/friends.module';
import { UserModule } from 'src/user/user.module';
import { DmService } from 'src/chat/dm/dm.service';
import { DmOutils } from 'src/chat/dm/dm.outils';


@Module({
  imports: [FriendsModule, UserModule],
  providers: [GameGateway, GameService,makeQueue, UserService, PrismaService, makeQueue, room, FriendsService, DmService, DmOutils],
})
export class GameModule {

}