import { BadRequestException, Body, Controller, Get, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { getId } from 'src/utils/getId';
import { ChangeNicknameDto } from './Dto/nicknameDto';
import { ChangePasswordDto } from './Dto/passwordDto';
import { publicProfileDto } from './Dto/publicProfileDto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}



	@UseGuards(JwtAuthGuard)
	@Post('pass')
	changePassword(@Body() payload: ChangePasswordDto, @Req() req) {
		const id = getId(req);
		return this.userService.changePassword(payload.password, id)
	}
	
	@UseGuards(JwtAuthGuard)
	@Post('nick')
	changeNickname(@Body() payload: ChangeNicknameDto, @Req() req) {
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
 	@Post('PublicProfile')
 	getPublicProfile(@Body() payload: publicProfileDto, @Req() req) {
		const id = getId(req);
		return this.userService.publicProfile(payload.nick, id);
  }
	@UseGuards(JwtAuthGuard)
	@Post('2FA')
	handleTwoFA(@Req() req) {
		const id = getId(req);
		return this.userService.TwoFA(id)
	}


	@Get('profiles')
	@UseGuards(JwtAuthGuard)
 	getProfiles() {
		return this.userService.getProfiles();
	}

	@Get('Dashboard')
	@UseGuards(JwtAuthGuard)
	getDashboard(@Req() req) {
		console.log("getFriends");
		const id = getId(req);
		return this.userService.getDashboard(id);
	}

	@Get('Leaderboard')
	@UseGuards(JwtAuthGuard)
 	getLeaderboard(@Req() req) {
		const id = getId(req);
		return this.userService.getLeaderboard(id);
	}
}

