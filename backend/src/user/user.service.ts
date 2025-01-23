import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findOne(email: string): Promise<User | null> {
    const users = await this.prisma.user.findMany({
      where: { email },
    });
    return users[0] || null;
  }
}
