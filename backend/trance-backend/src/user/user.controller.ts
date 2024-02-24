import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { getId } from 'src/utils/getId';
import { NicknameDto } from './Dto/nicknameDto';
import { ChangePasswordDto } from './Dto/passwordDto';
import { searchBarDto } from './Dto/searchBarDto';
import { Enable2FADto } from './Dto/enable2FADto';
import { IdDto } from './Dto/IdDto';

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
	changeNickname(@Body() payload: NicknameDto, @Req() req) {
		const id = getId(req);
		return this.userService.changeNickname(payload.nickname, id)
	}

	@Get('FirstLogin')
	firstLogin(@Req() req){
		const id = getId(req);
		return (this.userService.updateAchivements(id, "First Login"));
	}

	@Get('profile/:nickname')
	@UseGuards(JwtAuthGuard)
	getProfile(@Param() payload: NicknameDto, @Req() req)
	{
		const id = getId(req);
		return this.userService.getProfile(id, payload.nickname);
	}

	@UseGuards(JwtAuthGuard)
	@Post('2FA')
	handleTwoFA(@Body() payload: Enable2FADto, @Req() req) {
		const id = getId(req);
		return this.userService.TwoFA(id, payload.Enabled)
	}


	@Post('search')
	@UseGuards(JwtAuthGuard)
 	getProfiles(@Body() payload: searchBarDto) {
		if (payload.searchInput === "")
			return;
		return this.userService.getProfiles(payload.searchInput);
	}

	@Get('Dashboard')
	@UseGuards(JwtAuthGuard)
 	getDashboard(@Req() req) {
		const id = getId(req);
		return this.userService.getDashboard(id);
	}

	@Get('GenerateQr')
	@UseGuards(JwtAuthGuard)
 	getQrUrl(@Req() req) {
		const id = getId(req);
		return this.userService.generateQRUrl(id);
	}

	@Get('qrEnabled')
	@UseGuards(JwtAuthGuard)
 	getEnabled(@Req() req) {
		const id = getId(req);
		return this.userService.getEnabled(id);
	}

	@Get('Nickname')
	@UseGuards(JwtAuthGuard)
 	getNickname(@Req() req) {
		const id = getId(req);
		return this.userService.getNickname(id);
	}


	@Get('Friends')
	@UseGuards(JwtAuthGuard)
 	getFriends(@Req() req) {
		const id = getId(req);
		return this.userService.getFriendsCards(id);
	}

	@Get('Notifications')
	@UseGuards(JwtAuthGuard)
 	getNotificationsHistory(@Req() req) {
		const id = getId(req);
		return this.userService.getNotificationsHistory(id);
	}


	@Get('Leaderboard')
	@UseGuards(JwtAuthGuard)
 	getLeaderboard(@Req() req) {
		const id = getId(req);
		return this.userService.getLeaderboard(id);
	}

	
	@Post('FriendStatus')
	@UseGuards(JwtAuthGuard)
	getFriendStatus(@Body() payload: NicknameDto, @Req() req) {
		const id = getId(req);
		return this.userService.getFriendStatus(id, payload.nickname);
	}
	
	@Post('Achievements')
	@UseGuards(JwtAuthGuard)
	getAchievements(@Body() payload: IdDto, @Req() req) {
		return this.userService.getAchievements(payload.userId);
	}

	@UseGuards(JwtAuthGuard)
    @Post('MatchHistory')
    matchHistory(@Body() payload: IdDto, @Req() req){
        return this.userService.getMatches(payload.userId);
    }
}

