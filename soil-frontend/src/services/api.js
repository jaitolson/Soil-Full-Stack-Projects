import axios from 'axios';

const API_URL = 'http://localhost:4000/api'; // Ensure this URL is correct based on your backend setup

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    console.log(`Fetching product with ID: ${id}`);
    const response = await axios.get(`${API_URL}/products/${id}`);
    console.log('API response for product:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories`);
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// user //




export async function loginUser(userData) {
  
  const response = await axios.post(API_URL + "/users/signin", userData);
  const user = response.data;
  if (user!=null) {
    document.cookie = `user=${userData.email}; expires=Thu, 18 Dec 2030 12:00:00 UTC; path=/`;
  }


  return user;
}


export async function createUser(userData) {
  try {
    const response = await axios.post(API_URL + "/users/signup", userData);
    return response.data;
  } catch (error) {
    // If there's an error, throw it so it can be caught and handled in the calling code
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}
export async function getUser(email) {
  try { 
    const response = await axios.get(API_URL + "/users/select", {
      params: {
        email: email
      }
    });
    return response.data;
  } catch (error) {
    // If there's an error, throw it so it can be caught and handled in the calling code
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}  

export function getEmail() {
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');

      if (name.trim() === 'user') {
          return value; // Decode URI components to handle special characters
      }
  }

  return null; // If user cookie is not found
}
export function logout() {
  document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


export async function deleteProfile(userID) {
try {
  const response = await axios.delete(API_URL +`/users/${userID}`)
}
catch (error) {
  // If there's an error, throw it so it can be caught and handled in the calling code
  if (error.response && error.response.data) {
    throw new Error(error.response.data.error);
  } else {
    throw new Error('An unexpected error occurred');
  }
}
}

export async function updateUser(userID, userData) {
  try {
    const response = await axios.put(API_URL + `/users/${userID}`, userData);
    return response.data;
  } catch (error) {
    // If there's an error, throw it so it can be caught and handled in the calling code
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}



/// reviews
export const getReviews = async (productID) => {
  const response = await axios.get(API_URL +`/reviews/product/${productID}`);
  return response.data;
};

export const createReview = async (review) => {
  const response = await axios.post(API_URL+'/reviews', review);
  return response.data;
};

export const updateReview = async (reviewID, review) => {
  const response = await axios.put(API_URL+'/reviews/' + `${reviewID}`, review);
  return response.data;
};

export const deleteReview = async (reviewID) => {
  await axios.delete(API_URL + `/reviews/${reviewID}`);
};

// follow user
export const followUser = async (userID, name) => {
  try {
    const response = await axios.post(`${API_URL}/userFollows`, { userID, name });
    return response.data;
  } catch (error) {
    console.error('Error following user:', error.response?.data || error.message);
    throw error;
  }
};

export const checkFollowStatus = async (followerID, followingID) => {
  try {
    const response = await axios.post(`${API_URL}/userFollows/checkFollow`, { followerID, followingID });
    return response.data;
  } catch (error) {
    console.error('Error checking follow status:', error.response?.data || error.message);
    throw error;
  }
};

export const unfollowUser = async (followerID, followingID) => {
  try {
    const response = await axios.delete(`${API_URL}/userFollows`, { data: { followerID, followingID } });
    return response.data;
  } catch (error) {
    console.error('Error unfollowing user:', error.response?.data || error.message);
    throw error;
  }
};


export const addToCart = async (userID, productID, quantity) => {
  try {
    console.log(`Adding to cart: userID=${userID}, productID=${productID}, quantity=${quantity}`);
    const response = await axios.post(`${API_URL}/cartItems`, { userID, productID, quantity });
    console.log('API response for add to cart:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const fetchCart = async (userID) => {
  try {
    console.log(`Fetching cart for userID=${userID}`);
    const response = await axios.get(`${API_URL}/cartItems/${userID}`);
    console.log('API response for fetch cart:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const updateCartItem = async (cartItemID, quantity) => {
  try {
    console.log(`Updating cart item: cartItemID=${cartItemID}, quantity=${quantity}`);
    const response = await axios.put(`${API_URL}/cartItems/${cartItemID}`, { quantity });
    console.log('API response for update cart item:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = async (cartItemID) => {
  try {
    console.log(`Removing from cart: cartItemID=${cartItemID}`);
    const response = await axios.delete(`${API_URL}/cartItems/${cartItemID}`);
    console.log('API response for remove from cart:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
};

export const createOrder = async (order) => {
  try {
    const response = await axios.post(`${API_URL}/orders`, order);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};