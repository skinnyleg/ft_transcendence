import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { Strategy42 } from './42.strategy';
import { UserService } from 'src/user/user.service';
import { RefreshJwtStrategy } from './refresh.strategy';

@Module({
	imports: [JwtModule.register({
      global: true,
      secret: process.env.jwtsecret,
      signOptions: { expiresIn: '12h' },
    }), PassportModule],
  controllers: [AuthController],
  providers: [AuthService, PrismaService,Strategy42, JwtStrategy, RefreshJwtStrategy,UserService],
})
export class AuthModule {}
