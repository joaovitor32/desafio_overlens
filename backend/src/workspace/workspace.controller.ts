import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { WorkspaceService } from './workspace.service';
import { Workspace } from './workspace.model';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';

@Resolver(() => Workspace)
export class WorkspaceResolver {
  constructor(private readonly workspaceService: WorkspaceService) { }

  @UseGuards(AuthGuard)
  @Query(() => [Workspace])
  async getWorkspaces(@Context() context) {
    const userId = context.req.user.sub;
    return this.workspaceService.find(userId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Workspace)
  async createWorkspace(
    @Context() context,
    @Args('name') name: string,
    @Args('description', { nullable: true }) description: string,
  ) {
    const userId = context.req.user.sub;
    return this.workspaceService.create({ name, description }, userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => Workspace)
  async getWorkspaceDetails(
    @Context() context,
    @Args('workspaceId') workspaceId: string,
  ) {
    try {
      const userId = context.req.user.sub;

      return await this.workspaceService.getWorkspaceDetails(
        workspaceId,
        userId,
      );
    } catch (error) {
      throw new ApolloError(error.message);
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Workspace)
  async updateWorkspace(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('description', { nullable: true }) description: string,
  ) {
    return this.workspaceService.update(id, { name, description });
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteWorkspace(@Context() context, @Args('id') id: string) {
    try {
      const userId = context.req.user.sub;
      return this.workspaceService.delete(id, userId);
    } catch (error) {
      throw new ApolloError(error.message);
    }
  }
}
