import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.jwtsecret,
    });
  }

  private static async extractJWT(req: Request): Promise<string | null> {
    if (req.cookies && 'token' in req.cookies) {
		if (req.cookies.token.length > 0)
		{
		  const jwtService = new JwtService({ secret: process.env.jwtsecret });
		  try {
			await jwtService.verifyAsync(req.cookies.token);
			return req.cookies.token;
		  } catch (error) {
			// Handle verification error
			return null;
			// console.error('JWT verification failed:', error);
		  }
			// return req.cookies.token;
		}
    }
    return null;
  }

  async validate(payload: { id: string; login: string }) {
    return payload;
  }
}
