import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

export const graphQLClient = new GraphQLClient(endpoint as unknown as string);

export const fetcher = (query: string, variables = {}, headers = {}) => {
  graphQLClient.setHeaders(headers);

  return graphQLClient.request(query, variables);
};