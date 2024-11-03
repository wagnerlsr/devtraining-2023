import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { sign } from 'jsonwebtoken';
import { Model } from 'mongoose';
import * as process from 'process';
import request from 'supertest';

import { User } from '../users/models/users.model';
import { JwtPayload } from './models/jwt-payload.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly usersModel: Model<User>,
  ) {}

  public async createAccessToken(userId: string): Promise<string> {
    return sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
  }

  public async validateUser(jwtPayload: JwtPayload): Promise<User> {
    const user = await this.usersModel.findOne({ _id: jwtPayload.userId });

    if (!user) throw new UnauthorizedException('Usuario não encontrado.');

    return user;
  }

  public returnJwtExtractor(): (request: Request) => string {
    return this.jwtExtractor;
  }
  private jwtExtractor(request: Request): string {
    const authHeader = request.headers.authorization;

    if (!authHeader) throw new BadRequestException('Bad request.');

    const [, token] = authHeader.split(' ');

    return token;
  }
}
