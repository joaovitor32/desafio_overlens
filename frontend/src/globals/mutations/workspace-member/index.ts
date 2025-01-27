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

const GET_WORKSPACE_MEMBERS_QUERY = `
  query GetWorkspaceMembers($id: String!) {
    getWorkspaceMembers(id: $id) {
      id
      role
      userId
      workspaceId
      createdAt
      user {
        id
        name
        email
      }
    }
  }
`;

const REMOVE_WORKSPACE_MEMBER_MUTATION = gql`
  mutation RemoveWorkspaceMember($id: String!) {
    removeWorkspaceMember(id: $id)
  }
`;

const ADD_WORKSPACE_MEMBER_MUTATION = gql`
  mutation AddWorkspaceMember($role: String!, $workspaceId: String!, $email: String!) {
    addWorkspaceMember(role: $role, workspaceId: $workspaceId, email: $email) {
      id
      role
      userId
      workspaceId
      createdAt
    }
  }
`;


export {
  GET_WORKSPACE_MEMBER_QUERY,
  GET_WORKSPACE_MEMBERS_QUERY,
  REMOVE_WORKSPACE_MEMBER_MUTATION,
  ADD_WORKSPACE_MEMBER_MUTATION
};