import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { makeQueue, room } from './Queue.service';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';


@Module({
    imports: [],
  providers: [GameGateway, GameService,makeQueue, UserService, PrismaService, makeQueue, room],
})
export class GameModule {

}