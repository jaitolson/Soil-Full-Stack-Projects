const { gql } = require("apollo-server-express");
const { PubSub } = require("graphql-subscriptions");
const db = require("../models");

const REVIEW_ADDED = "REVIEW_ADDED";
const pubsub = new PubSub();

const typeDefs = gql`
  type User {
    userID: Int
    name: String!
    bio: String
    email: String!
    phone: String
    role: String
    createdAt: String
    updatedAt: String
    userBlock: Boolean
  }

  input UserInput {
    name: String!
    bio: String
    email: String!
    password: String!
    phone: String
    role: String
    userBlock: Boolean
  }

  type Product {
    productID: Int
    name: String!
    description: String
    price: Float!
    imagePath: String
  }

  input ProductInput {
    name: String!
    description: String
    price: Float!
    imagePath: String
  }

  type Review {
    name: String
    reviewID: Int
    productID: Int!
    userID: Int!
    rating: Int!
    comment: String
    createdAt: String
  }

  type ReviewMetric {
    averageRating: Float
    reviewsPerProduct: [ProductReviewCount]
  }

  type ProductReviewCount {
    productID: Int
    count: Int
  }

  type Query {
    allUsers: [User]
    user(name: String): User
    allProducts: [Product]
    latestReviews: [Review]
    reviewMetrics: ReviewMetric
    getReviews: [Review]
  }

  type Mutation {
    blockUser(name: String!): Boolean
    unblockUser(name: String!): Boolean
    addProduct(input: ProductInput!): Product
    editProduct(productID: Int!, input: ProductInput!): Product
    deleteProduct(productID: Int!): Boolean
    deleteReview(reviewID: Int!): Review
  }

  type Subscription {
    newReview: Review!
  }
`;

const resolvers = {
  Query: {
    allUsers: async () => {
      return await db.User.findAll();
    },
    user: async (_, args) => {
      return await db.User.findOne({ where: { name: args.name } });
    },
    allProducts: async () => {
      return await db.Product.findAll();
    },
    latestReviews: async () => {
      return await db.Review.findAll({
        limit: 3,
        order: [['createdAt', 'DESC']]
      });
    },
    reviewMetrics: async () => {
      const reviews = await db.Review.findAll();
      
      const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
      
      const productCounts = reviews.reduce((acc, review) => {
        acc[review.productID] = (acc[review.productID] || 0) + 1;
        return acc;
      }, {});
      
      const reviewsPerProduct = Object.entries(productCounts).map(([productID, count]) => ({
        productID: parseInt(productID),
        count
      }));
      
      return {
        averageRating,
        reviewsPerProduct
      };
    },
    getReviews: async () => {
      return await db.Review.findAll();
    }
  },
  Mutation: {
    blockUser: async (_, args) => {
      const user = await db.User.findOne({ where: { name: args.name } });
      if (!user) throw new Error('User not found');
      user.userBlock = true;
      await user.save();
      return true;
    },
    unblockUser: async (_, args) => {
      const user = await db.User.findOne({ where: { name: args.name } });
      if (!user) throw new Error('User not found');
      user.userBlock = false;
      await user.save();
      return true;
    },
    addProduct: async (_, args) => {
      const { name, description, price, imagePath } = args.input;
      const product = await db.Product.create({ name, description, price, imagePath });
      return product;
    },
    editProduct: async (_, args) => {
      const { productID, input } = args;
      const product = await db.Product.findByPk(productID);
      if (!product) throw new Error('Product not found');
      const { name, description, price } = input;
      product.name = name;
      product.description = description;
      product.price = price;
      await product.save();
      return product;
    },
    deleteProduct: async (_, args) => {
      const product = await db.Product.findByPk(args.productID);
      if (!product) throw new Error('Product not found');
      await product.destroy();
      return true;
    },
    deleteReview: async (_, args) => {
      const review = await db.Review.findByPk(args.reviewID);
      if (!review) throw new Error('Review not found');
      review.comment = "[**** This review has been deleted by the admin ***]";
      await review.save();
      return review;
    },
  },
  Subscription: {
    newReview: {
      subscribe: () => pubsub.asyncIterator(REVIEW_ADDED)
    }
  }
};

module.exports = {
  typeDefs,
  resolvers,
  pubsub
};
