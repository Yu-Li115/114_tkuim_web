const Review = require('../models/Review');
const sendResponse = require('../utils/responseHandler');

const createReview = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();
    sendResponse(res, 201, true, "Review Added", newReview);
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId });
    sendResponse(res, 200, true, "Success", reviews);
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, { 
      rating: req.body.rating, 
      comment: req.body.comment 
    }, { new: true });
    sendResponse(res, 200, true, "Review Updated", updatedReview);
  } catch (error) {
    sendResponse(res, 400, false, error.message);
  }
};

const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, true, "Review Deleted");
  } catch (error) {
    sendResponse(res, 500, false, error.message);
  }
};

module.exports = { createReview, getReviewsByProduct, updateReview, deleteReview };