import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { intraAuthGuard } from './42.guard';
import { authDto } from './Dto/authDto';
import { tokenDto } from './Dto/tokenDto';
import { JwtAuthGuard } from './jwt.guard';
import { REFRESHEXP, REFRESHSECRET, TOKENEXP, TOKENSECRET } from 'src/classes/classes';
import { RefreshJwtAuthGuard } from './refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}



	@Post('signin')
	async signIn(@Body() payload : authDto,  @Res() res)
	{
		return await this.authService.signIn(payload.username, payload.password, res);
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
		const token = await this.authService.createToken(request.user.id, request.user.login, TOKENEXP, TOKENSECRET)
		response.cookie('token', token, {signed: true})
		const refresh = await this.authService.createToken(request.user.id, request.user.login, REFRESHEXP, REFRESHSECRET)
		response.cookie('refresh', refresh, {signed: true})
		response.redirect(`${process.env.FrontendHost}/Dashboard`);
		// response.status(200).json(token);
	}

	@UseGuards(JwtAuthGuard)
	@Get('signout')
	signOut(@Res() res)
	{
		return this.authService.signOut(res)
	}


	@Post('CheckToken')
	CheckToken(@Body() payload: tokenDto, @Req() req, @Res() res)
	{
		if (req.signedCookies && 'token' in req.signedCookies) {
		  if (req.signedCookies.token.length > 0) {
				if (req.signedCookies.token === payload.token)
				{
					res.status(200).json(payload.token);
				}
		  }
		}
		throw new UnauthorizedException('not allowed');
	}



	@UseGuards(RefreshJwtAuthGuard)
	@Get('refresh')
	refreshTokens(@Req() req, @Res() res)
	{
		return this.authService.refreshTokens(req, res);
	}


}

