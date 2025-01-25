import gql from 'graphql-tag';

const GET_WORKSPACE_MEMBER_QUERY = gql`
  query($workspaceId: String!) {
    getWorkspaceMemberByWorkspaceAndUser(workspaceId: $workspaceId) {
      id
      role
      user {
        id
        email
        name
      }
      workspace {
        id
        name
        description
        documents {
          id
          title
          content
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export {
  GET_WORKSPACE_MEMBER_QUERY
};