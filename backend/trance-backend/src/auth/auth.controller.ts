import { Body, Controller, ForbiddenException, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { intraAuthGuard } from './42.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


	// @Post('signup')
	// signUp(@Body() authDto: AuthDto)
	// {
	// 	console.log("entered here")
	// 	return this.authService.signUp(authDto.username, authDto.password)
	// }



	@Post('signin')
	async signIn(@Body() payload : {username: string, password: string}, @Req() req, @Res() res)
	{
		return await this.authService.signIn(payload.username, payload.password, req, res)
	}

	@Get('42')
	@UseGuards(intraAuthGuard)
	intra42Auth(){}

	@Get('42/callback')
	@UseGuards(intraAuthGuard)
	async intra42AuthRedirect(@Req() request, @Res() response)
	{//request contains user_data, response used to bake cookies
		// pass the user data to the function that signs the jwt token
		console.log("token form user == ", request.user.token)
		if (request.user.isEnabled === true)
		{
			response.cookie('id', request.user.id)
			response.cookie('login', request.user.login)
			response.cookie('token', request.user.token);
			response.redirect(`${process.env.FrontendHost}/qrLogin`);
			return;
		}
		response.cookie('id', request.user.id)
		response.cookie('login', request.user.login)
		response.cookie('token', request.user.token);
		response.redirect(`${process.env.FrontendHost}/${request.user.login}`);
	}

	@Get('signout')
	signOut(@Req() req, @Res() res)
	{
		return this.authService.signOut(req,res)
	}






}

