import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Create ApolloClient instance
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

// Mutation functions

export async function loginUser({ email, password }) {
  try {
    const { data } = await client.query({
      query: gql`
        query LoginUser($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            token
            user {
              userBlock
            }
            error
          }
        }
      `,
      variables: { email, password }
    });
    return data.loginUser;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

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

export async function addProduct(productInput) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation AddProduct($input: ProductInput!) {
          addProduct(input: $input) {
            productID
            name
            price
            description
          }
        }
      `,
      variables: { input: productInput }
    });
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

export async function editProduct(productID, productInput) {
  try {
    const parsedProductID = parseInt(productID, 10);
    const { data } = await client.mutate({
      mutation: gql`
        mutation EditProduct($productID: Int!, $input: ProductInput!) {
          editProduct(productID: $productID, input: $input) {
            productID
            name
            description
            price
          }
        }
      `,
      variables: { productID: parsedProductID, input: productInput }
    });
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

export async function deleteProduct(productID) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation DeleteProduct($productID: Int!) {
          deleteProduct(productID: $productID)
        }
      `,
      variables: { productID }
    });
    console.log(data);
  } catch (error) {
    console.error(error.message);
  }
}

// Query functions
export async function getUsers() {
  try {
    const { data } = await client.query({
      query: gql`
        query {
          allUsers {
            userID
            name
            createdAt
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

export async function getProducts() {
  try {
    const { data } = await client.query({
      query: gql`
        query {
          allProducts {
            productID
            name
            description
            price
          }
        }
      `,      fetchPolicy: 'no-cache', // Disable caching for this mutation

    });
    return data.allProducts;
  } catch (error) {
    console.error('Error fetching products:', error.message);
    throw error;
  }
}


export async function getReviews() {
  try {
    const { data } = await client.query({
      query: gql`
        query {
          getReviews {
            name
            userID
            reviewID
            comment
          }
        }
      `,      fetchPolicy: 'no-cache', // Disable caching for this mutation

    });
    return data.getReviews;
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    throw error;
  }
}
export async function deleteReview(reviewID) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation DeleteReview($reviewID: Int!) {
          deleteReview(reviewID: $reviewID){
            userID
            reviewID
            name
            comment

          }
        }
      `,
      variables: { reviewID }, // Match the variable name
    });
    console.log("succesfully deleted review");
    console.log(data);

  } catch (error) {
    console.error('Error deleting review:', error.message); // Corrected error message
    throw error;
  }
}
