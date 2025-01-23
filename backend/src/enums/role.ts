import { registerEnumType } from '@nestjs/graphql';

export enum MemberRole {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}

registerEnumType(MemberRole, {
  name: 'MemberRole',
});
