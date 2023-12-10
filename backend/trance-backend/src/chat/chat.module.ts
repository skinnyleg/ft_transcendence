import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChannelService } from './channel/channel.service';
import { DmOutils } from './dm/dm.outils';
import { DmService } from './dm/dm.service';
import { ChatGateway } from './gateway/chat.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { ChannelOutils } from './channel/outils';

@Module({
  controllers: [ChatController],
  providers: [DmOutils, ChannelOutils, PrismaService, UserService, ChannelService, DmService, ChatGateway]
})
export class ChatModule {}
