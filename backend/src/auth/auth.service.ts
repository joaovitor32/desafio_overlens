import * as bcrypt from 'bcrypt';

import { ApolloError } from 'apollo-server-express';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ accessToken: string; name: string; email: string }> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new ApolloError('User not found', 'UNAUTHORIZED');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (!isPasswordValid) {
      throw new ApolloError('Invalid credentials', 'UNAUTHORIZED');
    }

    const payload = { sub: user.id, name: user.name };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '8h',
      }),
      name: user.name,
      email: user.email,
    };
  }

  async signup(name: string, email: string, password: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ApolloError('Invalid credentials', 'UNAUTHORIZED');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return newUser;
  }
}
