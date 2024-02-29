import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { SignInDTO } from './dto';

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signIn({ email, password }: SignInDTO) {
    const user = await this.usersService.findOneByEmail(email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { email };

    const expiresIn = this.configService.get('JWT_EXPIRES_IN');
    const token = await this.jwtService.signAsync(payload, { expiresIn });

    return { token };
  }
}
