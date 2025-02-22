import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Document } from 'src/document/document.model';
import { WorkspaceMember } from 'src/workspace-member/workspace-member.model';

@ObjectType()
export class Workspace {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [WorkspaceMember])
  members: WorkspaceMember[];

  @Field(() => [Document])
  documents: Document[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
