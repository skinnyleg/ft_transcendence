import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { QrModule } from './qr/qr.module';
import { UploadModule } from './upload/upload.module';
import { FriendsModule } from './friends/friends.module';
import { GameModule } from './GameGateway/game.module';
import { ChatModule } from './chat/chat.module';
import { ChannelOutils } from './chat/channel/outils';
import { DmOutils } from './chat/dm/dm.outils';
import { UserService } from './user/user.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), AuthModule, PrismaModule, UserModule, QrModule, UploadModule, FriendsModule, ChatModule, GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
