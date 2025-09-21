const userService = require('../../services/userService');
const productService = require('../../services/productService');
const saleService = require('../../services/saleService');

module.exports = {
  Query: {
    products: () => productService.getProducts()
  },
  Mutation: {
    registerUser: (_, { username, password }) => {
      return userService.registerUser({ username, password }).message;
    },
    login: (_, { username, password }) => {
      return userService.loginUser({ username, password }).token;
    },
    registerProduct: (_, { name, type, price }) => {
      return productService.registerProduct({ name, type, price }).message;
    },

    // Resolver ajustado para devolver message e price corretamente
    sell: (_, { productName, quantity, coupon }, context) => {
      try {
        const username = context?.user?.username; // pega usuário do contexto (se houver)
        const result = saleService.sellProduct({ username, productName, quantity, coupon });

        // result já contém { username, productName, quantity, price, message }
        // retornamos explicitamente os campos que queremos expor no GraphQL
        return {
          message: result.message,
          price: result.price,
          productName: result.productName
        };
      } catch (err) {
        // Lança o erro para o GraphQL; se usar Apollo Server, pode usar ApolloError
        throw new Error(err.message);
      }
    }
  }
};
