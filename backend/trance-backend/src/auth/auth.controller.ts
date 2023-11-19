import { Body, Controller, Get, Logger, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { intraAuthGuard } from './42.guard';
import { authDto } from './Dto/authDto';
import { JwtAuthGuard } from './jwt.guard';
import { tokenDto } from './Dto/tokenDto';

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
		// response.cookie('id', request.user.id)
		if (request.user.isEnabled === true)
		{
			response.redirect(`${process.env.FrontendHost}/Qr`);
			return;
		}
		const token = await this.authService.createToken(request.user.id, request.user.login)
		response.cookie('token', token, {signed: true})
		// response.cookie('token', token)
		// response.redirect(`${process.env.FrontendHost}/Dashboard`);
		response.status(200).json(token);
		// return ({token : token})
	}

	@Get('signout')
	signOut(@Req() req, @Res() res)
	{
		return this.authService.signOut(req,res)
	}


	@Post('CheckToken')
	CheckToken(@Body() payload: tokenDto, @Req() req, @Res() res)
	{
		if (req.signedCookies && 'token' in req.signedCookies) {
		  if (req.signedCookies.token.length > 0) {
				if (req.signedCookies.token === payload.token)
					res.status(200).json(payload.token);
		  }
		}
		throw new UnauthorizedException('not allowed')
	}





}

