import { Module } from '@nestjs/common';
import { QrService } from './qr.service';
import { QrController } from './qr.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [UserModule, PrismaModule],
  controllers: [QrController],
  providers: [QrService, UserService],
})
export class QrModule {}
