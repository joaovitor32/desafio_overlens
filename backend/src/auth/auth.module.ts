import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { jwtConstants } from './auth.constants';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
