import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:3000/api' });
export const fetchProducts = () => API.get('/products');
export const createReview = (reviewData) => API.post('/reviews', reviewData);
export const fetchReviews = (productId) => API.get(`/reviews/${productId}`);
export const updateReview = (id, updatedData) => API.put(`/reviews/${id}`, updatedData);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);