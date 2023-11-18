import { Body, Controller, Get, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { intraAuthGuard } from './42.guard';
import { authDto } from './Dto/authDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



	@Post('signin')
	async signIn(@Body() payload : authDto,  @Res() res)
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
		response.cookie('id', request.user.id, {signed: true})
		if (request.user.isEnabled === true)
		{
			response.redirect(`${process.env.FrontendHost}/Qr`);
			return;
		}
		const token = await this.authService.createToken(request.user.id, request.user.login)
		response.cookie('token', token, {signed: true})
		response.redirect(`${process.env.FrontendHost}/Dashboard`);
	}

	@Get('signout')
	signOut(@Req() req, @Res() res)
	{
		return this.authService.signOut(req,res)
	}






}

