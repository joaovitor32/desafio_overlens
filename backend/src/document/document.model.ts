import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Document {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field()
  workspaceId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
