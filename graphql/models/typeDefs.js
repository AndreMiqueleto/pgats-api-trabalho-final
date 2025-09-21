const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    username: String!
  }
  type Product {
    name: String!
    type: String!
    price: Float!
  }
  type Sale {
    username: String!
    productName: String!
    quantity: Int!
    price: Float!
  }
  type Query {
    products: [Product]
  }
  type SaleResult {
    message: String
    price: Float
    productName: String
  }
  type Mutation {
    registerUser(username: String!, password: String!): String
    login(username: String!, password: String!): String
    registerProduct(name: String!, type: String!, price: Float!): String
    sell(productName: String!, quantity: Int!, coupon: String): SaleResult
  }
`;
