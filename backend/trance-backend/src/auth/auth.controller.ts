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
		const token = await this.authService.createToken(request.user.id, request.user.nickname, TOKENEXP, TOKENSECRET)
		const refresh = await this.authService.createToken(request.user.id, request.user.nickname, REFRESHEXP, REFRESHSECRET)
		response.cookie('token', token, {signed: true, maxAge: TOKENEXP * 1000})
		response.cookie('refresh', refresh, {signed: true, maxAge: REFRESHEXP * 1000})
		if (request.user.FirstLogin === true)
			response.redirect(`${process.env.FrontendHost}/settings`);
		response.redirect(`${process.env.FrontendHost}/Dashboard`);
		// response.status(200).json(token);
	}

	@UseGuards(JwtAuthGuard)
	@Get('signout')
	signOut(@Res() res)
	{
		return this.authService.signOut(res)
	}


	@UseGuards(JwtAuthGuard)
	@Post('CheckToken')
	CheckToken(@Body() payload: tokenDto, @Req() req, @Res() res)
	{
		if (req.signedCookies && 'token' in req.signedCookies) {
		  if (req.signedCookies.token.length > 0) {
			if (payload.token === "")
				res.status(200).json(req.signedCookies.token);
			else if (req.signedCookies.token === payload.token)
				res.status(200).json(payload.token);
		  }
		}
		throw new UnauthorizedException('not allowed')
	}



	@UseGuards(RefreshJwtAuthGuard)
	@Get('refresh')
	refreshTokens(@Req() req, @Res() res)
	{
		return this.authService.refreshTokens(req, res);
	}


}

