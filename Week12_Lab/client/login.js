document.getElementById('loginBtn').onclick = async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const res = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
        
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
      alert('登入成功');
      oadParticipants();
  } else {
      const data = await res.json();
      alert('登入失敗: ' + data.error);
    }
};

document.getElementById('logoutBtn').onclick = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    await fetch('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken');
  location.reload();
};

async function loadParticipants() {
  const token = localStorage.getItem('token');
  const listElement = document.getElementById('participantList');
  listElement.innerHTML = ''; 
  if (!token) return;

  const res = await fetch('/api/signup', {
    headers: { Authorization: `Bearer ${token}` }
  });
    
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
    alert('登入狀態已過期，請重新登入！');
    return;
  }
    
  if (res.ok) {
    const data = await res.json();
    const currentUser = JSON.parse(localStorage.getItem('user'));
    data.data.forEach(p => {
      const li = document.createElement('li');
      li.textContent = `${p.name} (${p.phone})`;
      const isAdmin = currentUser?.role === 'admin';
      const isOwner = p.ownerId.toString() === currentUser?._id; 

      if (isAdmin || isOwner) {
        const btn = document.createElement('button');
        btn.textContent = '刪除';
        btn.onclick = async () => {
          if (confirm('確認刪除嗎？')) {
            const deleteRes = await fetch(`/api/signup/${p._id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` }
            });

            if (deleteRes.ok) {
              alert('刪除成功');
              loadParticipants(); 
            } else {
                const errorData = await deleteRes.json();
                alert('刪除失敗: ' + errorData.error);
              }
          }
        };
        li.appendChild(btn);
      }
      listElement.appendChild(li);
    });
  } else {
      const data = await res.json();
      alert('載入資料失敗: ' + data.error);
    }
}