document.getElementById('signupBtn').onclick = async () => {
  const token = localStorage.getItem('token');    
  if (!token) {
    return alert('請先登入');
  }
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const res = await fetch('/api/signup', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ name, phone })
  });

  if (res.ok) {
    alert('報名成功');
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    loadParticipants(); 
  } else {
      if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken'); 
        return alert('登入狀態已過期，請重新登入！');
      }
      
      const data = await res.json();
      alert('報名失敗: ' + data.error);
    }
};