import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { WorkspaceResolver } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

@Module({
  providers: [WorkspaceResolver, WorkspaceService, PrismaService],
})
export class WorkspaceModule { }
