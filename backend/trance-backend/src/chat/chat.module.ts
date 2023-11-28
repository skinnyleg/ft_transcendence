import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChannelService } from './channel/channel.service';
import { DmService } from './dm/dm.service';
import { GatewayGateway } from './gateway/chat.gateway';

@Module({
  controllers: [ChatController],
  providers: [ChannelService, DmService, GatewayGateway]
})
export class ChatModule {}
