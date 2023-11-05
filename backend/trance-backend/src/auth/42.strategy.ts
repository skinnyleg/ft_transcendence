import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-42";
import { PrismaClient } from '@prisma/client'
// import { UsersService } from "src/users/users.service";
import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { UserStatus } from "src/classes/classes";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
// import { CreateUserDto } from "src/users/dto/create-user.dto";
// import { CreateTodoDto } from "src/todo/dto/create-todo.dto";

@Injectable()
export class Strategy42 extends PassportStrategy(Strategy, '42') {
	private prisma = new PrismaClient();

	constructor(private readonly usersService: UserService,
				private readonly authService: AuthService) {
		super({
			clientID: process.env.client_id,
			clientSecret: process.env.client_secret,
			callbackURL: process.env.callback_url,
		})
	}

	// extract the info from the profile object provided by the oauth
	extractUserData(profile: any, accessToken: string) {

		console.log("accessToken == ", accessToken)
	  const user = {
    intraId: profile._json.id,
    email: profile._json.email,
    login: profile._json.login,
    firstName: profile._json.first_name,
    lastName: profile._json.last_name,
    profilePic: profile._json.image.link,
    wallet: profile._json.wallet,
    level: profile._json.cursus_users[1].level,
    grade: profile._json.cursus_users[1].grade,
	status: UserStatus.ONLINE,
	// isEnabled: false,
	// Secret: null,
	// otpauth_url: null,
	// nickname: "newUser"
  };
  return user;
}

	// this function is called by the oauth
	async validate(accessToken: string, refreshToken: string, profile: any, cb: Function)
				//stayed for a week	,  stayed for a month use it to generate a new accessToken
	{
		const user = this.extractUserData(profile, accessToken);
		let userExits: any = await this.usersService.findOneByIntraId(user.intraId);
		if (!userExits)
		{
			const token = await this.authService.createToken(user.intraId, user.login)
			userExits = await this.usersService.create(user, token)
			userExits.token = token;
		}
		return cb(null, userExits);
	}
}
