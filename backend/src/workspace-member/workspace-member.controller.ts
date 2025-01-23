import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { WorkspaceMemberService } from './workspace-member.service';
import { WorkspaceMember } from './workspace-member.model';
import { ApolloError } from 'apollo-server-express';
import { MemberRole } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver(() => WorkspaceMember)
export class WorkspaceMemberResolver {
  constructor(
    private readonly workspaceMemberService: WorkspaceMemberService,
  ) { }

  @UseGuards(AuthGuard)
  @Query(() => [WorkspaceMember])
  async getWorkspaceMembers(@Context() context) {
    try {
      const userId = context.req.user.sub;

      return await this.workspaceMemberService.findAll(userId);
    } catch (error) {
      throw new ApolloError('Error fetching workspace members', 'FETCH_ERROR', {
        detail: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => WorkspaceMember)
  async createWorkspaceMember(
    @Context() context,
    @Args('role') role: MemberRole,
    @Args('workspaceId') workspaceId: string,
  ) {
    try {
      const userId = context.req.user.sub;
      return await this.workspaceMemberService.create({
        role,
        user: { connect: { id: userId } },
        workspace: { connect: { id: workspaceId } },
      });
    } catch (error) {
      throw new ApolloError('Error creating workspace member', 'CREATE_ERROR', {
        detail: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => WorkspaceMember)
  async updateWorkspaceMember(
    @Context() context,
    @Args('id') id: string,
    @Args('role') role: MemberRole,
    @Args('workspaceId') workspaceId: string,
  ) {
    try {
      const userId = context.req.user.sub;
      return await this.workspaceMemberService.update(id, {
        role,
        user: { connect: { id: userId } },
        workspace: { connect: { id: workspaceId } },
      });
    } catch (error) {
      throw new ApolloError('Error updating workspace member', 'UPDATE_ERROR', {
        detail: error.message,
      });
    }
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async deleteWorkspaceMember(@Args('id') id: string) {
    try {
      return await this.workspaceMemberService.delete(id);
    } catch (error) {
      throw new ApolloError('Error deleting workspace member', 'DELETE_ERROR', {
        detail: error.message,
      });
    }
  }
}
