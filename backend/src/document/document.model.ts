import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Workspace } from 'src/workspace/workspace.model';

@ObjectType()
export class Document {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => Workspace)
  workspace: Workspace;

  @Field()
  workspaceId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
