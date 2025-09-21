const products = require('../models/productModel');

function registerProduct({ name, type, price }) {
  if (!name || !type || !price) throw new Error('All fields required');
  products.push({ name, type, price });
  return { message: 'Product registered' };
}

function getProducts() {
  return products;
}

exports.register = (req, res) => {
  try {
    const result = registerProduct(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.list = (req, res) => {
  res.json(getProducts());
};

exports.registerProduct = registerProduct;
exports.getProducts = getProducts;
