import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChannelService } from './channel/channel.service';
import { DmService } from './dm/dm.service';
import { ChatGateway } from './gateway/chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [ChatController],
  providers: [ChannelService, DmService, ChatGateway, PrismaService, UserService]
})
export class ChatModule {}
