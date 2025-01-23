import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthResolver } from './auth/auth.controller';
import { DocumentModule } from './document/document.module';
import { GraphQLModule } from '@nestjs/graphql';
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { WorkspaceMemberModule } from './workspace-member/workspace-member.module';
import { WorkspaceModule } from './workspace/workspace.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
    }),
    AuthModule,
    UserModule,
    WorkspaceModule,
    WorkspaceMemberModule,
    DocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthResolver],
})
export class AppModule { }
