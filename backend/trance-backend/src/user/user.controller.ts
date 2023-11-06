import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



	@UseGuards(JwtAuthGuard)
	@Post('pass')
	changePassword(@Body() payload :{password: string, oldPassword: string}, @Req() req) {
		const id = req.cookies.id;
		console.log("id == ", typeof id);
		console.log("id == ", id);
		// return this.userService.changePassword(payload.password, payload.login, payload.oldPassword)
	}
	
	@UseGuards(JwtAuthGuard)
	@Post('nick')
	changeNickname(@Body() payload :{nick: string, login: string}) {
		return this.userService.changeNickname(payload.nick, payload.login)
	}

	@UseGuards(JwtAuthGuard)
 	@Get('userProfile')
 	getUserProfile(@Query('user') login: string) {
    // Now, the `login` variable contains the value of the 'user' parameter from the query string.
		return this.userService.userProfile(login);

    // Your logic here
  }

	@UseGuards(JwtAuthGuard)
	@Post('2FA')
	handleTwoFA(@Body() payload :{login: string, twoFA: boolean}) {
		if (payload.twoFA === true)
			return this.userService.enableTwoFA(payload.login)
		else if (payload.twoFA === false)
			return this.userService.disableTwoFA(payload.login)
	}
}

