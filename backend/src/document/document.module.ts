import { DocumentResolver } from './document.controller';
import { DocumentService } from './document.service';
import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  providers: [DocumentService, DocumentResolver, PrismaService],
})
export class DocumentModule { }
