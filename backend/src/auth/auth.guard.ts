import { CanActivate, ExecutionContext } from '@nestjs/common';

import { ApolloError } from 'apollo-server-express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  canActivate(context: ExecutionContext): boolean {
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ApolloError('Authorization token is missing', 'UNAUTHORIZED', {
        statusCode: 500,
      });
    }

    try {
      const user = this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch {
      throw new ApolloError('Invalid or expired token', 'UNAUTHORIZED', {
        statusCode: 500,
      });
    }
  }
}
