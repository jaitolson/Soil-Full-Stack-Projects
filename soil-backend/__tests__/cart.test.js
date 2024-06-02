// This unit test file is designed to validate the functionality of a cart management system's API by using 
// axios-mock-adapter to simulate API requests and responses. The test suite includes three key test cases: 
// adding an item to the cart, fetching all cart items for a specific user, and updating a cart item. 
// In each case, the mock adapter intercepts and simulates the corresponding API requests (POST, GET, and PUT) to 
// the /cartItems endpoint. The first test checks if the addToCart function correctly handles adding an item and 
// returns the expected response. The second test verifies that the fetchCart function retrieves all items for a 
// user accurately. The third test ensures the updateCartItem function updates the item details correctly. 
// By mocking these requests, the tests confirm that the functions behave as expected without requiring a live backend, 
// ensuring reliable and isolated testing of the cart API functionality.


import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { addToCart, fetchCart, updateCartItem } from '../../soil-frontend/src/services/api'; // Adjust path as necessary

const API_URL = 'http://localhost:4000/api'; // Ensure this URL is correct based on your backend setup

// Setting up the mock adapter on the default axios instance
const mock = new MockAdapter(axios);

// Mocking the POST request to /cartItems
mock.onPost(`${API_URL}/cartItems`).reply(201, {
  cartItemID: 1,
  userID: 12,
  productID: 3,
  quantity: 2,
});

// Mocking the GET request to /cartItems/:userID
mock.onGet(`${API_URL}/cartItems/12`).reply(200, [
  { cartItemID: 1, userID: 12, productID: 3, quantity: 2 },
]);

// Mocking the PUT request to /cartItems/:cartItemID
mock.onPut(`${API_URL}/cartItems/1`).reply(200, {
  cartItemID: 1,
  userID: 12,
  productID: 3,
  quantity: 5,
});

describe('Cart API', () => {
  /**
   * Test case: should add an item to the cart
   * This test verifies that an item can be successfully added to the user's cart.
   */
  it('should add an item to the cart', async () => {
    const cartItem = await addToCart(12, 3, 2);
    expect(cartItem).toEqual({
      cartItemID: 1,
      userID: 12,
      productID: 3,
      quantity: 2,
    });
  });

  /**
   * Test case: should fetch all cart items for a user
   * This test verifies that all cart items for a specific user can be fetched.
   */
  it('should fetch all cart items for a user', async () => {
    const cartItems = await fetchCart(12);
    expect(cartItems).toEqual([
      { cartItemID: 1, userID: 12, productID: 3, quantity: 2 },
    ]);
  });

  /**
   * Test case: should update a cart item
   * This test verifies that a cart item can be successfully updated.
   */
  it('should update a cart item', async () => {
    const updatedCartItem = await updateCartItem(1, 5);
    expect(updatedCartItem).toEqual({
      cartItemID: 1,
      userID: 12,
      productID: 3,
      quantity: 5,
    });
  });
});
