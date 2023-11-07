import { BadRequestException, Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { getId } from 'src/utils/getId';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



	@UseGuards(JwtAuthGuard)
	@Post('pass')
	changePassword(@Body() payload :{password: string, oldPassword: string}, @Req() req) {
		const id = getId(req);
		return this.userService.changePassword(payload.password, id, payload.oldPassword)
	}
	
	@UseGuards(JwtAuthGuard)
	@Post('nick')
	changeNickname(@Body() payload :{nick: string, login: string}, @Req() req) {
		const id = getId(req);
		return this.userService.changeNickname(payload.nick, id)
	}

	@UseGuards(JwtAuthGuard)
 	@Get('PrivateProfile')
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

    // Your logic here
  }
	@UseGuards(JwtAuthGuard)
	@Post('2FA')
	handleTwoFA(@Body() payload :{twoFA: boolean}, @Req() req) {

		const id = getId(req);
		const login = req.cookies.login;
		if (payload.twoFA === true)
			return this.userService.enableTwoFA(login , id)
		else if (payload.twoFA === false)
			return this.userService.disableTwoFA(id)
	}
}

