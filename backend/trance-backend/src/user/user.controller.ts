import { BadRequestException, Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



	@UseGuards(JwtAuthGuard)
	@Post('pass')
	changePassword(@Body() payload :{password: string, oldPassword: string}, @Req() req) {
		const idString = req.cookies.id
		const id = parseInt(idString, 10)
		if (isNaN(id))
			throw new BadRequestException('id not valid number')
		return this.userService.changePassword(payload.password, id, payload.oldPassword)
	}
	
	@UseGuards(JwtAuthGuard)
	@Post('nick')
	changeNickname(@Body() payload :{nick: string, login: string}, @Req() req) {
		const idString = req.cookies.id
		const id = parseInt(idString, 10)
		if (isNaN(id))
			throw new BadRequestException('id not valid number')
		return this.userService.changeNickname(payload.nick, id)
	}

	@UseGuards(JwtAuthGuard)
 	@Get('PrivateProfile')
 	getPrivateProfile(@Req() req) {
    // Now, the `login` variable contains the value of the 'user' parameter from the query string.
		const idString = req.cookies.id
		const id = parseInt(idString, 10)
		if (isNaN(id))
			throw new BadRequestException('id not valid number')
		return this.userService.privateProfile(id);

    // Your logic here
  }

	@UseGuards(JwtAuthGuard)
 	@Get('PublicProfile')
 	getPublicProfile(@Query('user') login: string) {
    // Now, the `login` variable contains the value of the 'user' parameter from the query string.
		return this.userService.publicProfile(login);

    // Your logic here
  }
	@UseGuards(JwtAuthGuard)
	@Post('2FA')
	handleTwoFA(@Body() payload :{twoFA: boolean}, @Req() req) {
		const idString = req.cookies.id
		const id = parseInt(idString, 10)
		if (isNaN(id))
			throw new BadRequestException('id not valid number')

		const login = req.cookies.login;
		if (payload.twoFA === true)
			return this.userService.enableTwoFA(login , id)
		else if (payload.twoFA === false)
			return this.userService.disableTwoFA(id)
	}
}

