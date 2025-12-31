import React, { useState, useEffect } from 'react';
import { fetchProducts, fetchReviews, createReview, deleteReview, updateReview } from './api';
import { Coffee, Star, Trash2, Edit2, Send } from 'lucide-react';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });
  const [isEditing, setIsEditing] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await fetchProducts();
    setProducts(res.data.data);
  };

  const loadReviews = async (productId) => {
    const res = await fetchReviews(productId);
    setReviews(res.data.data);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    loadReviews(product._id);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateReview(isEditing, newReview);
      setIsEditing(null);
    } else {
      await createReview({ ...newReview, product: selectedProduct._id });
    }
    setNewReview({ userName: '', rating: 5, comment: '' });
    loadReviews(selectedProduct._id);
  };

  const handleDeleteReview = async (id) => {
    await deleteReview(id);
    loadReviews(selectedProduct._id);
  };

  const startEdit = (review) => {
    setIsEditing(review._id);
    setNewReview({ userName: review.userName, rating: review.rating, comment: review.comment });
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Digital Cafe</h1>
      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 1 }}>
          <h2>Menu</h2>
          {products.map(product => (
            <div key={product._id} onClick={() => handleSelectProduct(product)} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', cursor: 'pointer' }}>
              <Coffee /> {product.name} - ${product.price}
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {selectedProduct ? (
            <>
              <h2>Reviews for {selectedProduct.name}</h2>
              <form onSubmit={handleSubmitReview}>
                <input placeholder="Your Name" value={newReview.userName} onChange={e => setNewReview({...newReview, userName: e.target.value})} required />
                <select value={newReview.rating} onChange={e => setNewReview({...newReview, rating: e.target.value})}>
                  {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                </select>
                <textarea placeholder="Comment" value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} required />
                <button type="submit"><Send /> {isEditing ? 'Update' : 'Post'}</button>
              </form>

              <div>
                {reviews.map(review => (
                  <div key={review._id} style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
                    <strong>{review.userName}</strong> ({review.rating} <Star size={14} />)
                    <p>{review.comment}</p>
                    <button onClick={() => startEdit(review)}><Edit2 size={14} /></button>
                    <button onClick={() => handleDeleteReview(review._id)}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </>
          ) : <p>Select a product to see reviews</p>}
        </div>
      </div>
    </div>
  );
}

export default App;