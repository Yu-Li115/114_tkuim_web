const Product = require('../models/Product');

const checkAndReduceStock = async (productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');
  if (product.stock < quantity) throw new Error('Insufficient stock');
  
  product.stock -= quantity;
  await product.save();
  return product;
};

module.exports = { checkAndReduceStock };