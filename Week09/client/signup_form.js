const form = document.getElementById('signup-form'); 
const inputs = form.querySelectorAll('input');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const interests = document.getElementById('interests');
const strengthBar = document.getElementById('strength-bar-fill');
const strengthText = document.getElementById('strength-text');

function saveToLocal() {
  inputs.forEach(input => {
    if (input.type === 'checkbox') {
      localStorage.setItem(input.id, input.checked);
    } else {
      localStorage.setItem(input.id, input.value);
    }
   });
}
function loadFromLocal() {
  inputs.forEach(input => {
    const val = localStorage.getItem(input.id);
    if (val !== null) {
      if (input.type === 'checkbox') input.checked = val === 'true';
      else input.value = val;
    }
  });
}
loadFromLocal();

function showError(input, message) {
  input.setCustomValidity(message);
  const errorElem = document.getElementById(`${input.id}-error`);
  if(errorElem) errorElem.textContent = message;
  input.reportValidity();
}

function clearError(input) {
  input.setCustomValidity('');
  const errorElem = document.getElementById(`${input.id}-error`);
  if(errorElem) errorElem.textContent = '';
}

function checkPasswordStrength(value) {
  let score = 0;
  if (/[a-zA-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) score++;
  if (value.length >= 12) score++;
  const levels = ['弱', '中', '強', '非常強'];
  const colors = ['#f66', '#fc3', '#6c6', '#3c9'];
  const idx = Math.max(score - 1, 0);
  strengthBar.style.width = `${(score / 4) * 100}%`;
  strengthBar.style.backgroundColor = colors[idx];
  strengthText.textContent = value ? `密碼強度：${levels[idx]}` : '密碼強度：尚未輸入';
}
function validateInput(input) {
  const value = input.value.trim();
  let message = '';
  if (input.validity.valueMissing) message = '此欄位為必填';
  else if (input.id === 'email' && input.validity.typeMismatch) message = '請輸入正確的 Email 格式';
  else if (input.id === 'phone' && !/^\d{10}$/.test(value)) message = '手機號碼必須為 10 位數字';
  else if (input.id === 'password') {
    if (value.length < 8) message = '密碼至少需 8 碼';
    else if (!/[A-Za-z]/.test(value) || !/\d/.test(value) || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) message = '密碼需含英文字母、數字與符號';
  } else if (input.id === 'confirm') {
    const pwd = document.getElementById('password').value.trim();
    if (value !== pwd) message = '兩次密碼輸入不一致';
  }
  if (message) showError(input, message);
  else clearError(input);
  saveToLocal();
}

form.addEventListener('blur', e => { if (e.target.tagName === 'INPUT') validateInput(e.target); }, true);
form.addEventListener('input', e => { if (e.target.id === 'password') checkPasswordStrength(e.target.value); if (e.target.tagName === 'INPUT') validateInput(e.target); }, true);

interests.addEventListener('change', () => {
  const checkedCount = interests.querySelectorAll('input[type="checkbox"]:checked').length;
  const error = document.getElementById('interest-error');
  error.textContent = checkedCount > 0 ? '' : '請至少選擇 1 項興趣';
  saveToLocal();
});

document.getElementById('terms').addEventListener('change', e => { if(e.target.checked) alert("服務條款內容：\n\n1. 本網站會員需遵守規則\n2. 會員資料將受保護\n3. 使用服務即表示同意條款"); });

const apiResultEl = document.createElement('pre');
apiResultEl.id = 'api-result';
apiResultEl.style.background = '#f8f9fa';
apiResultEl.style.border = '1px solid #ccc';
apiResultEl.style.padding = '10px';
apiResultEl.style.marginTop = '20px';
form.parentNode.appendChild(apiResultEl);

const viewBtn = document.createElement('button');
viewBtn.type = 'button';
viewBtn.textContent = '查看報名清單';
viewBtn.className = 'btn btn-secondary mt-3';
form.parentNode.appendChild(viewBtn);

async function submitSignupAPI(payload, retries = 1) {
  try {
    const res = await fetch('http://localhost:3001/api/signup', { // 👈 URL 已修正
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || '報名失敗');
    return data;
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 3000));
      return submitSignupAPI(payload, retries - 1);
    }
    throw err;
  }
}

async function getSignupList() {
  const res = await fetch('http://localhost:3001/api/signup'); 
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || '取得失敗');
  return data;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  let firstInvalid = null;

  inputs.forEach(input => { validateInput(input); if (!input.checkValidity() && !firstInvalid) firstInvalid = input; });
  const checked = interests.querySelectorAll('input[type="checkbox"]:checked').length;
  if (checked === 0) { document.getElementById('interest-error').textContent = '請至少選擇 1 項興趣'; if (!firstInvalid) firstInvalid = interests.querySelector('input[type="checkbox"]'); }
  const termsCheckbox = document.getElementById('terms');
  if (!termsCheckbox.checked) { document.getElementById('terms-error').textContent = '請勾選服務條款'; if (!firstInvalid) firstInvalid = termsCheckbox; } else { document.getElementById('terms-error').textContent = ''; }
  if (firstInvalid) { firstInvalid.focus(); return; }
  const formData = new FormData(form);
  const apiPayload = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
  };
  
  try {
    submitBtn.disabled = true;
    submitBtn.textContent = '送出中...';
    const result = await submitSignupAPI(apiPayload, 1); 
    alert(`✅ 報名成功！資料 ID: ${result.id}`); 

    form.reset();
    strengthBar.style.width = '0';
    strengthText.textContent = '密碼強度：尚未輸入';
    inputs.forEach(input => localStorage.removeItem(input.id));
  } catch (error) {
    alert(`❌ 報名失敗: ${error.message}`);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
  }
});

viewBtn.addEventListener('click', async () => {
  apiResultEl.textContent = '讀取中...';
  try {
    const list = await getSignupList();
    apiResultEl.textContent = JSON.stringify(list, null, 2);
  } catch (error) {
    apiResultEl.textContent = `❌ ${error.message}`;
  }
});

resetBtn.addEventListener('click', () => {
  form.reset();
  document.querySelectorAll('.error-msg').forEach(p => p.textContent = '');
  strengthBar.style.width = '0';
  strengthText.textContent = '密碼強度：尚未輸入';
  inputs.forEach(input => localStorage.removeItem(input.id));
});