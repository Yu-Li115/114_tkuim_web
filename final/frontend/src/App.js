import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Coffee, Trash2, MessageCircle, Edit3, X } from 'lucide-react';

const API_BASE = "http://localhost:3000/api";

function App() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/products`)
      .then(res => {
        setProducts(res.data.data);
        setLoading(false);
      })
      .catch(err => console.error("抓取失敗", err));
  }, []);

  const fetchReviews = async (productId) => {
    const product = products.find(p => p._id === productId);
    setSelectedProduct(product);
    setEditingReview(null);
    try {
      const res = await axios.get(`${API_BASE}/reviews/${productId}`);
      setReviews(res.data.data);
    } catch (err) { console.error(err); }
  };

  const startEdit = (review) => {
    setEditingReview(review._id);
    setNewReview({ userName: review.userName, rating: review.rating, comment: review.comment });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      if (editingReview) {
        const res = await axios.put(`${API_BASE}/reviews/${editingReview}`, newReview);
        setReviews(reviews.map(r => r._id === editingReview ? res.data.data : r));
        setEditingReview(null);
        alert("✅ 評論已更新！");
      } else {
        const res = await axios.post(`${API_BASE}/reviews`, { ...newReview, product: selectedProduct._id });
        setReviews([res.data.data, ...reviews]);
        alert("✨ 感謝您的評價！");
      }
      setNewReview({ userName: '', rating: 5, comment: '' });
    } catch (err) { alert("操作失敗"); }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("確定要刪除這條評論嗎？")) return;
    try {
      await axios.delete(`${API_BASE}/reviews/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) { alert("刪除失敗"); }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>咖啡廳準備中...</div>;

  return (
    <div className="App-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fdfaf6' }}>
      {/* 側邊欄 */}
      <div className="sidebar-area" style={{ width: '280px', backgroundColor: '#6f4e37', color: 'white', padding: '40px 20px', flexShrink: 0 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Coffee /> Digital Cafe</h2>
        <p style={{ opacity: 0.7, fontSize: '14px' }}>114 期末專題演示</p>
        <hr style={{ opacity: 0.2, margin: '20px 0' }} />
        <nav>
          <div style={{ padding: '12px 15px', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>🏠 首頁選單</div>
        </nav>
      </div>

      {/* 主內容區 */}
      <div className="content-area" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px' }}>今日精選咖啡</h1>
          <p style={{ color: '#8d6e63' }}>請選擇品項以查看或修改評論</p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
          {products.map(p => (
            <div key={p._id} onClick={() => fetchReviews(p._id)} style={{
              backgroundColor: 'white', padding: '20px', borderRadius: '15px', cursor: 'pointer',
              boxShadow: selectedProduct?._id === p._id ? '0 0 0 3px #6f4e37' : '0 4px 6px rgba(0,0,0,0.05)',
              textAlign: 'center'
            }}>
              <h3>{p.name}</h3>
              <p style={{ color: '#d35400', fontWeight: 'bold' }}>NT$ {p.price}</p>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <div style={{ marginTop: '40px', backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <h2>{editingReview ? '📝 修改評論' : '💬 發表評論'}</h2>
            <form onSubmit={handleSubmitReview} style={{ display: 'flex', gap: '10px', margin: '20px 0', flexWrap: 'wrap' }}>
              <input style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: '1' }} placeholder="名字" value={newReview.userName} onChange={e => setNewReview({...newReview, userName: e.target.value})} required />
              <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} value={newReview.rating} onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} 顆星</option>)}
              </select>
              <input style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: '2' }} placeholder="留言..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} required />
              <button type="submit" style={{ backgroundColor: editingReview ? '#27ae60' : '#6f4e37', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
                {editingReview ? '更新' : '送出'}
              </button>
              {editingReview && <button type="button" onClick={() => {setEditingReview(null); setNewReview({userName:'', rating:5, comment:''})}} style={{ background: '#eee', border: 'none', padding: '10px', borderRadius: '8px' }}><X size={18}/></button>}
            </form>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
              {reviews.map(r => (
                <div key={r._id} style={{ padding: '15px 0', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <strong>{r.userName}</strong>
                      <span style={{ color: '#f1c40f' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    </div>
                    <p style={{ margin: '5px 0 0 0', color: '#666' }}>{r.comment}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => startEdit(r)} style={{ color: '#6f4e37', background: 'none', border: 'none', cursor: 'pointer' }}><Edit3 size={18}/></button>
                    <button onClick={() => handleDeleteReview(r._id)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;