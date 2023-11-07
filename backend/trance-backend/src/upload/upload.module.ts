import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule,
    PrismaModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
