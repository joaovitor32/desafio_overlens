import gql from 'graphql-tag';

const CREATE_WORKSPACE_MUTATION = gql`
  mutation CreateWorkspace($name: String!, $description: String!) {
    createWorkspace(name: $name, description: $description) {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

const GET_WORKSPACES_QUERY = gql`
  query {
    getWorkspaces {
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;

const DELETE_WORKSPACE_MUTATION = gql`
  mutation DeleteWorkspace($id: String!) {
    deleteWorkspace(id: $id)
  }
`;

export {
  CREATE_WORKSPACE_MUTATION,
  GET_WORKSPACES_QUERY,
  DELETE_WORKSPACE_MUTATION
};