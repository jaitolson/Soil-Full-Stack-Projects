import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Create ApolloClient instance
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

// Export client for use in other modules
export default client;

// Mutation functions
export async function blockUser(name) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation BlockUser($name: String!) {
          blockUser(name: $name)
        }
      `,
      variables: { name }
    });
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

export async function unblockUser(name) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation UnblockUser($name: String!) {
          unblockUser(name: $name)
        }
      `,
      variables: { name }
    });
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

export async function getUsers() {
  try {
    const { data } = await client.query({
      query: gql`
        query {
          allUsers {
            userID
            name
            email
            userBlock
          }
        }
      `
    });
    return data.allUsers;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
}
