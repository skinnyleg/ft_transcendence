import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { QrModule } from './qr/qr.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, QrModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
