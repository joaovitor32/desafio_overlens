import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { WorkspaceMemberResolver } from './workspace-member.controller';
import { WorkspaceMemberService } from './workspace-member.service';

@Module({
  providers: [WorkspaceMemberResolver, WorkspaceMemberService, PrismaService],
})
export class WorkspaceMemberModule { }
