import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { QrModule } from './qr/qr.module';
import { UploadModule } from './upload/upload.module';
import { FriendsModule } from './friends/friends.module';
import { GameModule } from './GameGateway/game.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, QrModule, UploadModule, FriendsModule, GameModule ],
  controllers: [],
  providers: [],
})
export class AppModule {}
