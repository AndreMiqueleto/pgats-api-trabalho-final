const products = require('../models/productModel');
const users = require('../models/userModel');
const sales = require('../models/saleModel');

const COUPONS = {
  DIADOPROGRAMADOR: 0.15,
  AULATOPJULIAO: 0.5
};

function sellProduct({ username, productName, quantity, coupon }) {
  if (!username) throw new Error('Authentication required');
  if (!productName || !quantity) throw new Error('Product and quantity required');
  if (quantity > 3) throw new Error('Max 3 items per sale');
    const product = products.find(p => p.name === productName);
  if (!product) throw new Error('Product not found');
    const userSales = sales.filter(s => s.username === username && s.productName === productName);
    const totalSold = userSales.reduce((sum, s) => sum + s.quantity, 0);
  if (totalSold + quantity > 3) throw new Error('Max 3 items per user');
    let price = product.price * quantity;
  let message = 'Sale completed';
  if (coupon) {
    if (!COUPONS[coupon]) {
      throw new Error('Invalid coupon');
    } else {
      price = price * (1 - COUPONS[coupon]);
      message = `Sale completed with coupon ${coupon} applied!`;
    }
  }
    const sale = { username, productName, quantity, price };
    sales.push(sale);
  return { ...sale, message };
}

exports.sell = (req, res) => {
  try {
    const username = req.user.username;
    const result = sellProduct({ username, ...req.body });
    res.json({ message: result.message, price: result.price });
  } catch (err) {
    if (err.message === 'Product not found') return res.status(404).json({ error: err.message });
    res.status(400).json({ error: err.message });
  }
};

exports.sellProduct = sellProduct;
