import gql from 'graphql-tag';

const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument($title: String!, $content: String!, $workspaceId: String!) {
    createDocument(title: $title, content: $content, workspaceId: $workspaceId) {
        id
        title
        content
        workspaceId
        createdAt
        updatedAt
    }
  }
`;

const EDIT_DOCUMENT_MUTATION = gql`
  mutation EditDocument($id: String!, $title: String!, $content: String!, $workspaceId: String!) {
    updateDocument(id: $id, title: $title, content: $content, workspaceId: $workspaceId) {
      id
      title
      content
      workspaceId
      createdAt
      updatedAt
    }
  }
`;

export {
  EDIT_DOCUMENT_MUTATION,
  CREATE_DOCUMENT_MUTATION,
};