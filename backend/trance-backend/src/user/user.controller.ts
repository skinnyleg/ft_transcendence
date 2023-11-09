import { BadRequestException, Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { getId } from 'src/utils/getId';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



	@UseGuards(JwtAuthGuard)
	@Post('pass')
	changePassword(@Body() payload :{password: string}, @Req() req) {
		const id = getId(req);
		return this.userService.changePassword(payload.password, id)
	}
	
	@UseGuards(JwtAuthGuard)
	@Post('nick')
	changeNickname(@Body() payload :{nick: string}, @Req() req) {
		if (payload.nick === undefined)
			throw new BadRequestException('nick is undefined')
			
		const id = getId(req);
		return this.userService.changeNickname(payload.nick, id)
	}

 	@Get('PrivateProfile')
	@UseGuards(JwtAuthGuard)
 	getPrivateProfile(@Req() req) {
		const id = getId(req);
		return this.userService.privateProfile(id);
  }

	@UseGuards(JwtAuthGuard)
 	@Get('PublicProfile')
 	getPublicProfile(@Query('user') login: string) {
		if (login === undefined)
			throw new BadRequestException('login is undefined')
		return this.userService.publicProfile(login);
  }
	@UseGuards(JwtAuthGuard)
	@Post('2FA')
	handleTwoFA(@Req() req) {

		const id = getId(req);
		return this.userService.TwoFA(id)
	}
}

