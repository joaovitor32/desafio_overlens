import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WorkspaceService } from './workspace.service';
import { Workspace } from './workspace.model';

@Resolver(() => Workspace)
export class WorkspaceResolver {
  constructor(private readonly workspaceService: WorkspaceService) { }

  @Query(() => [Workspace])
  async getWorkspaces() {
    return this.workspaceService.findAll();
  }

  @Mutation(() => Workspace)
  async createWorkspace(
    @Args('name') name: string,
    @Args('description', { nullable: true }) description: string,
  ) {
    return this.workspaceService.create({ name, description });
  }

  @Mutation(() => Workspace)
  async updateWorkspace(
    @Args('id') id: string,
    @Args('name') name: string,
    @Args('description', { nullable: true }) description: string,
  ) {
    return this.workspaceService.update(id, { name, description });
  }

  @Mutation(() => Boolean)
  async deleteWorkspace(@Args('id') id: string) {
    return this.workspaceService.delete(id);
  }
}
