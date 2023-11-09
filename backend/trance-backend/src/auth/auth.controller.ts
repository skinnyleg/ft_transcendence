import { Body, Controller, Get, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { intraAuthGuard } from './42.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



	@Post('signin')
	async signIn(@Body() payload : {username: string, password: string},  @Res() res)
	{
		return await this.authService.signIn(payload.username, payload.password, res)
	}

	@Get('42')
	@UseGuards(intraAuthGuard)
	intra42Auth(){}

	@Get('42/callback')
	@UseGuards(intraAuthGuard)
	async intra42AuthRedirect(@Req() request, @Res() response)
	{
		response.cookie('id', request.user.id)
		console.log("login is -", request.user.login)
		response.cookie('login', request.user.login)
		if (request.user.isEnabled === true)
		{
			response.redirect(`${process.env.FrontendHost}/qrLogin`);
			return;
		}
		response.redirect(`${process.env.FrontendHost}/Dashboard`);
	}

	@Get('signout')
	signOut(@Req() req, @Res() res)
	{
		return this.authService.signOut(req,res)
	}






}

