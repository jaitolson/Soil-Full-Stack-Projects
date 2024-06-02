// This unit test file is designed to verify the functionality of the `createReview` function within a review 
// management system's API using `axios-mock-adapter` to mock API requests and responses. The test suite includes 
// a single test case focused on creating a review. The mock adapter is set up to intercept and simulate a POST 
// request to the `/reviews` endpoint, providing a predefined response. The test case checks whether the `createReview` 
// function correctly handles the creation of a new review for a specified product by a particular user. 
// It verifies that the function returns the expected response, which includes the review ID, user ID, product ID, 
// comment, and rating. By mocking the API request, this test ensures that the `createReview` function operates as 
// intended without requiring a live backend, allowing for isolated and reliable testing of the review API functionality.

import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { createReview } from '../../soil-frontend/src/services/api'; // Adjust path as necessary

const API_URL = 'http://localhost:4000/api'; // Ensure this URL is correct based on your backend setup

// Setting up the mock adapter on the default axios instance
const mock = new MockAdapter(axios);

// Mocking the POST request to /reviews
mock.onPost(`${API_URL}/reviews`).reply(201, {
  reviewID: 1,
  userID: 12,
  productID: 3,
  comment: 'This is a great product!',
  rating: 5,
});

// Unit test for the createReview function
describe('Review API', () => {
  /**
   * Test case: should create a review
   * This test verifies that a review can be successfully created for a given product by a specific user.
   */
  it('should create a review', async () => {
    // Create a new review
    const newReview = await createReview({
      userID: 12,
      productID: 3,
      comment: 'This is a great product!',
      rating: 5,
    });

    // Verify the review was created successfully
    expect(newReview).toEqual({
      reviewID: 1,
      userID: 12,
      productID: 3,
      comment: 'This is a great product!',
      rating: 5,
    });
  });
});
