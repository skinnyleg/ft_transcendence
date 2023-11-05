import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { QrModule } from './qr/qr.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, QrModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
