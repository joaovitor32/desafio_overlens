import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken?: string;

  @Field()
  name: string;

  @Field()
  email: string;
}
