import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { QrModule } from './qr/qr.module';
import { UploadModule } from './upload/upload.module';
import { FriendsGatewayModule } from './friends-gateway/friends-gateway.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, QrModule, UploadModule, FriendsGatewayModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
