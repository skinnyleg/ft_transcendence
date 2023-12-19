import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy,'refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: process.env.refreshjwtsecret,
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'refresh' in req.cookies) {
      if (req.cookies.refresh.length > 0) {
        return req.cookies.refresh;
      }
    }
    return null;
  }

  async validate(payload: { id: string; login: string }) {
    return payload;
  }
}

