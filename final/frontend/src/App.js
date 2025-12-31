import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Coffee, Trash2, MessageCircle, Star } from 'lucide-react';

const API_BASE = "http://localhost:3000/api";

function App() {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newReview, setNewReview] = useState({ userName: '', rating: 5, comment: '' });
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
    try {
      const res = await axios.get(`${API_BASE}/reviews/${productId}`);
      setReviews(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/reviews`, { ...newReview, product: selectedProduct._id });
      setReviews([res.data.data, ...reviews]);
      setNewReview({ userName: '', rating: 5, comment: '' });
      alert("✨ 感謝您的評價！");
    } catch (err) { alert("送出失敗"); }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("確定要刪除這條評論嗎？")) return;
    try {
      await axios.delete(`${API_BASE}/reviews/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
    } catch (err) { alert("刪除失敗"); }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '20px' }}>☕ 咖啡廳準備中...</div>;

  return (
    <div className="App-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fdfaf6', color: '#442c2e' }}>
      {/* 側邊導覽列 */}
      <div className="sidebar-area" style={{ width: '280px', backgroundColor: '#6f4e37', color: 'white', padding: '40px 20px', flexShrink: 0 }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px' }}><Coffee /> Digital Cafe</h2>
        <p style={{ opacity: 0.7, fontSize: '14px', marginBottom: '30px' }}>114 期末專題演示</p>
        <hr style={{ opacity: 0.2, margin: '20px 0' }} />
        <nav>
          <div style={{ padding: '12px 15px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', marginBottom: '10px' }}>🏠 首頁選單</div>
          <div style={{ padding: '12px 15px', opacity: 0.5, cursor: 'not-allowed' }}>📜 歷史訂單 (預留)</div>
        </nav>
      </div>

      {/* 主內容區 */}
      <div className="content-area" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>今日精選咖啡</h1>
          <p style={{ color: '#8d6e63' }}>請選擇品項以查看或留下評論</p>
        </header>

        {/* 商品網格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
          {products.map(p => (
            <div key={p._id} onClick={() => fetchReviews(p._id)} style={{
              backgroundColor: 'white', padding: '25px', borderRadius: '20px', cursor: 'pointer',
              boxShadow: selectedProduct?._id === p._id ? '0 0 0 3px #6f4e37' : '0 4px 15px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease', textAlign: 'center'
            }}>
              <div style={{ backgroundColor: '#fdf0e6', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 15px' }}>
                <Coffee size={24} color="#6f4e37" />
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{p.name}</h3>
              <p style={{ color: '#d35400', fontWeight: 'bold', fontSize: '16px' }}>NT$ {p.price}</p>
            </div>
          ))}
        </div>

        {/* 評論抽屜 */}
        {selectedProduct && (
          <div style={{ marginTop: '50px', backgroundColor: 'white', padding: '35px', borderRadius: '25px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}><MessageCircle color="#6f4e37" /> {selectedProduct.name} - 評論區</h2>
              <span style={{ backgroundColor: '#6f4e37', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px' }}>{reviews.length} 則評價</span>
            </div>

            {/* 新增評論表單 */}
            <form onSubmit={handleSubmitReview} style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
              <input style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid #eee', flex: '1', minWidth: '150px' }} placeholder="您的名字" value={newReview.userName} onChange={e => setNewReview({...newReview, userName: e.target.value})} required />
              <select style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid #eee', backgroundColor: 'white' }} value={newReview.rating} onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} 顆星</option>)}
              </select>
              <input style={{ padding: '12px 15px', borderRadius: '10px', border: '1px solid #eee', flex: '2', minWidth: '250px' }} placeholder="分享您的咖啡心得..." value={newReview.comment} onChange={e => setNewReview({...newReview, comment: e.target.value})} required />
              <button type="submit" style={{ backgroundColor: '#6f4e37', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>送出評論</button>
            </form>

            {/* 評論列表 */}
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '10px' }}>
              {reviews.map(r => (
                <div key={r._id} style={{ padding: '20px 0', borderBottom: '1px solid #f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <strong style={{ fontSize: '16px' }}>{r.userName}</strong>
                      {/* 找回來的星星顯示邏輯 */}
                      <span style={{ color: '#f1c40f', fontSize: '14px' }}>
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>{r.comment}</p>
                  </div>
                  <button onClick={() => handleDeleteReview(r._id)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }} title="刪除評論">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {reviews.length === 0 && <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>暫時還沒有評論，快來當第一個評價的人吧！</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;