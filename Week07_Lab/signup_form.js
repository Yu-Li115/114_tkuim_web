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

  if (input.validity.valueMissing) {
    message = '此欄位為必填';
  } else if (input.id === 'email' && input.validity.typeMismatch) {
    message = '請輸入正確的 Email 格式';
  } else if (input.id === 'phone' && !/^\d{10}$/.test(value)) {
    message = '手機號碼必須為 10 位數字';
  } else if (input.id === 'password') {
    if (value.length < 8) message = '密碼至少需 8 碼';
    else if (!/[A-Za-z]/.test(value) || !/\d/.test(value) || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      message = '密碼需含英文字母、數字與符號';
    }
  } else if (input.id === 'confirm') {
    const pwd = document.getElementById('password').value.trim();
    if (value !== pwd) message = '兩次密碼輸入不一致';
  }

  if (message) showError(input, message);
  else clearError(input);

  saveToLocal();
}

// 事件委派：blur
form.addEventListener('blur', (e) => {
  if (e.target.tagName === 'INPUT') validateInput(e.target);
}, true);

// 事件委派：input
form.addEventListener('input', (e) => {
  if (e.target.id === 'password') checkPasswordStrength(e.target.value);
  if (e.target.tagName === 'INPUT') validateInput(e.target);
}, true);

// 興趣標籤事件
interests.addEventListener('change', () => {
  const checkedCount = interests.querySelectorAll('input[type="checkbox"]:checked').length;
  const error = document.getElementById('interest-error');
  error.textContent = checkedCount > 0 ? '' : '請至少選擇 1 項興趣';
  saveToLocal();
});

// 服務條款彈窗
document.getElementById('terms').addEventListener('change', (e) => {
  if(e.target.checked){
    alert("服務條款內容：\n\n1. 本網站會員需遵守規則\n2. 會員資料將受保護\n3. 使用服務即表示同意條款");
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = '送出中...';

  let firstInvalid = null;
  inputs.forEach(input => {
    validateInput(input);
    if (!input.checkValidity() && !firstInvalid) firstInvalid = input;
  });

  const checked = interests.querySelectorAll('input[type="checkbox"]:checked').length;
  if (checked === 0) {
    document.getElementById('interest-error').textContent = '請至少選擇 1 項興趣';
    if (!firstInvalid) firstInvalid = interests.querySelector('input[type="checkbox"]');
  }

  const termsCheckbox = document.getElementById('terms');
  if (!termsCheckbox.checked) {
    document.getElementById('terms-error').textContent = '請勾選服務條款';
    if (!firstInvalid) firstInvalid = termsCheckbox;
  } else {
    document.getElementById('terms-error').textContent = '';
  }

  if (firstInvalid) {
    firstInvalid.focus();
    submitBtn.disabled = false;
    submitBtn.textContent = '送出';
    return;
  }

  await new Promise(r => setTimeout(r, 1000));
  alert('✅ 註冊成功！');
  form.reset();
  strengthBar.style.width = '0';
  strengthText.textContent = '密碼強度：尚未輸入';
  inputs.forEach(input => localStorage.removeItem(input.id));
  submitBtn.disabled = false;
  submitBtn.textContent = '送出';
});

// 重設按鈕
resetBtn.addEventListener('click', () => {
  form.reset();
  document.querySelectorAll('.error-msg').forEach(p => p.textContent = '');
  strengthBar.style.width = '0';
  strengthText.textContent = '密碼強度：尚未輸入';
  inputs.forEach(input => localStorage.removeItem(input.id));
});