const express = require('express');
const router = express.Router();
const { createReview, getReviewsByProduct, updateReview, deleteReview } = require('../controllers/reviewController');

router.post('/', createReview);
router.get('/:productId', getReviewsByProduct);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

module.exports = router;