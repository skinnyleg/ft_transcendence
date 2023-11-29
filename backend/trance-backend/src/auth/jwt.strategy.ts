import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {;
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.jwtsecret,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.signedCookies && 'token' in req.signedCookies) {
      if (req.signedCookies.token.length > 0) {
        return req.signedCookies.token;
      }
    }
    return null;
  }

  async validate(payload: { id: string; login: string }) {
    return payload;
  }
}
