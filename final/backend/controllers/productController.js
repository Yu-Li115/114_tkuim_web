const Product = require('../models/Product');
const sendResponse = require('../utils/responseHandler');

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    sendResponse(res, 200, true, "Success", products);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendResponse(res, 404, false, "Product not found");
    sendResponse(res, 200, true, "Success", product);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    sendResponse(res, 201, true, "Product Created", newProduct);
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    sendResponse(res, 200, true, "Product Updated", updatedProduct);
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, true, "Product Deleted");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };